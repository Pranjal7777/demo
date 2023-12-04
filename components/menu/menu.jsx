import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";

const StyledMenu = withStyles({
  paper: {
    // border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

export default function CustomizedMenus(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleHover(event) {
    props.handleHover ? props.handleHover() : "";
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
    props.onClose ? props.onClose() : "";
  }

  // function handleCloseMenu() {
  //   props.handleHoverClose ? props.handleCloseMenu() : "";
  //   setAnchorEl(null);
  // }

  const { menuLabel } = props;

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
          textTransform: "capitalize"
        }}
        // color="primary"
        onClick={handleClick}
        onMouseMove={handleHover}
        // onMouseOut={handleCloseMenu}
      >
        {menuLabel}
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* <StyledMenuItem> */}
        {props.children}
        {/* </StyledMenuItem> */}
      </StyledMenu>
    </div>
  );
}
