import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles((theme)=> ({
  gutters : {
    background : "var(--l_app_bg2) !important"
  },
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: props?.theme?.sectionBackground,
      color: props?.theme?.text
    },
    "& .Mui-selected ": {
      backgroundColor: props?.theme?.sectionBackground,
      color: props?.theme?.text
    }
  }
}))

export default function FadeMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [select, setSelect] = React.useState(props.selected);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [mobileView] = isMobile();
  const classes = useStyles({theme})()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedValue = (event) => {
    const { filterOption } = props;
    setAnchorEl(null);
    setSelect(filterOption[event]);
    return props.handleSelectedFilter(filterOption[event] || select);
  };

  return (
    <div>
      <div
        aria-controls="fade-menu"
        onClick={handleClick}
        className="cursorPtr"
      >
        <FilterListIcon color={theme.sectionBackground} />
      </div>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        className={classes.menu + " fadeMenu"}
      >
        {props?.filterOption.map((filter, index) => (
          <MenuItem className={`${filter.label == props.selectedFilter && classes.gutters}`} onClick={() => selectedValue(index)} key={index}>
            {filter.label}
          </MenuItem>
        ))}
      </Menu>
      <style jsx>{`

          :global(.notificationDrawer .MuiPopover-paper){
            top: 66px !important;
          }
          :global(.fadeMenu .MuiPopover-paper) {
            background: rgba(0, 0, 0, 0.32) !important;
            backdrop-filter: blur(4px) !important;
            border-radius: 13px !important;
            border: 1px solid var(--l_border) !important;
            width: max-content !important;
            padding: 0px !important;
          }
          :global(.fadeMenu li){
            list-style: none !important;
            padding: 14px 55px !important;
            border-bottom: 1.5px solid var(--l_border);
            letter-spacing: 0.49996px;
            cursor: pointer;
            font-size: 14px !important;
          }
          :global(.fadeMenu li:hover) {
            color: var(--l_base) !important;
          }
          :global(.fadeMenu .MuiMenu-list) {
            padding: 0 !important;
          }

      `}</style>
    </div>
  );
}
