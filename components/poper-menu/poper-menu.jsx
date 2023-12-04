// import React from "react";
// import Button from "@material-ui/core/Button";
// import ClickAwayListener from "@material-ui/core/ClickAwayListener";
// import Grow from "@material-ui/core/Grow";
// import Paper from "@material-ui/core/Paper";
// import Popper from "@material-ui/core/Popper";
// import MenuItem from "@material-ui/core/MenuItem";
// import MenuList from "@material-ui/core/MenuList";
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles(theme => ({
//   root: {
//     display: "flex"
//   },
//   paper: {
//     marginRight: theme.spacing(2)
//   }
// }));

// export default function PopperMenu(props) {
//   const classes = useStyles();
//   const [open, setOpen] = React.useState(false);
//   const anchorRef = React.useRef(null);

//   const handleToggle = () => {
//     setOpen(prevOpen => !prevOpen);
//   };

//   const handleClose = event => {
//     if (anchorRef.current && anchorRef.current.contains(event.target)) {
//       return;
//     }

//     setOpen(false);
//   };

//   function handleListKeyDown(event) {
//     if (event.key === "Tab") {
//       event.preventDefault();
//       setOpen(false);
//     }
//   }

//   // return focus to the button when we transitioned from !open -> open
//   const prevOpen = React.useRef(open);
//   React.useEffect(() => {
//     if (prevOpen.current === true && open === false) {
//       anchorRef.current.focus();
//     }

//     prevOpen.current = open;
//   }, [open]);

//   return (
//     <div className={classes.root}>
//       <div>
//         <Button
//           ref={anchorRef}
//           aria-controls="menu-list-grow"
//           aria-haspopup="true"
//           onClick={handleToggle}
//         >
//           {props.initiator}
//         </Button>
//         <Popper
//           open={open}
//           anchorEl={anchorRef.current}
//           // keepMounted
//           transition
//           // disablePortal
//           style={{ zIndex: 9999 }}
//         >
//           {({ TransitionProps, placement }) => (
//             <Grow
//               {...TransitionProps}
//               style={{
//                 transformOrigin:
//                   placement === "bottom" ? "center top" : "center bottom"
//               }}
//             >
//               <Paper id="menu-list-grow">
//                 <ClickAwayListener onClickAway={handleClose}>
//                   {props.children}
//                 </ClickAwayListener>
//               </Paper>
//             </Grow>
//           )}
//         </Popper>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  typography: {
    padding: "0px 16px",
    width: "105px",
    display: "flex",
    justifyContent: "center"
  }
}));

export default function SimplePopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <a aria-describedby={id} variant="contained" onClick={handleClick}>
        {props.initiator}
      </a>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Typography className={classes.typography}>{props.children}</Typography>
      </Popover>
    </div>
  );
}
