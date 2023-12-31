import React from "react";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const StyledBadge1 = withStyles(theme => ({
  badge: {
    right: -3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px"
  }
}))(Badge);

const StyledBadge2 = withStyles(theme => ({
  badge: {
    backgroundColor: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid #44b700",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}))(Badge);

const SmallAvatar = withStyles(theme => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`
  }
}))(Avatar);

export default function CustomizedBadges(props) {
  return (
    <Box display="flex">
      <Box m={1}>
        <IconButton aria-label="cart">
          <StyledBadge1 badgeContent={props.badgeContent} color="primary">
            {props.children}
          </StyledBadge1>
        </IconButton>
      </Box>
    </Box>
  );
}
