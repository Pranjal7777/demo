import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import Image from "../image/image";

const styles = (theme) => ({
  buttonClass: {
    minWidth: "fit-content",
    width: "fit-content",
    padding: "0",
  },
  menuList: {
    padding: "0 !important",
    margin: "0 !important",
  },
  menuPaper: {
    background: "#2B313E",
    padding: "0",
  },
  iconRoot: {
    minWidth: "2.928vw",
  },
  menuLabel: {
    color: "#fff",
    fontFamily: `"Roboto", sans-serif !important`,
    fontSize: "1.171vw",
  },
});

const DropdownMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { button, classes, menuItems } = props;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        color="primary"
        classes={{ root: classes.buttonClass }}
        onClick={handleClick}
      >
        {button}
      </Button>
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{ paper: classes.menuPaper, list: classes.menuList }}
      >
        {menuItems &&
          menuItems.length &&
          menuItems.map((item, index) => (
            <MenuItem key={index} onClick={() => item.onClick(item.label)}>
              <ListItemIcon classes={{ root: classes.iconRoot }}>
                <Image
                  src={item.icon}
                  style={{
                    maxWidth: `${item.iconWidth}`,
                    maxHeight: `${item.iconHeight}`,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                classes={{ primary: classes.menuLabel }}
              />
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default withStyles(styles)(DropdownMenu);
