import React from 'react';
import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Icon from "../../components/image/icon";
import { PROFILE_INACTIVE_ICON, Wallet_Icon } from '../../lib/config';
import { createTheme } from '@material-ui/core/styles'
import { height } from '@mui/system';
import { handleContextMenu } from '../../lib/helper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    textAlign: 'center',
    margin: 'auto',
    boxShadow: 'none !important',
    borderRadius: 'none',
    padding: '0px 0px',
    background: `var(--l_app_bg)`,
  },
  accordion: {
    textAlign: 'center',
    margin: 'auto',
    boxShadow: 'none !important',
    borderRadius: 'none',
    background: `var(--l_app_bg) !important`
  },
  accordionSummary: {
    width: '100%',
    boxShadow: 'none !important',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    width: "100%",
    textAlign: "left",
    marginLeft: "20px",
    fontSize: '30px'
  },
}));

export default function SimpleAccordion(props) {
  const classes = useStyles();
  const {
    items,
    children,
    icon,
    iconId,
    viewBox,
    theme,
    onClick,
    log,
    defaultExpanded,
    ...otherProps
  } = props;

  const handleRedirect = (url) => {
    router.push(url)
  }

  const handleOpenDrawer = (onClick) => {
    onClick()
  }
  return (
    <div className={`${classes.root} simpleAccordian ${props.isAgency && "agencyBackground"}`}>
      <Accordion defaultExpanded={defaultExpanded} className={classes.accordion} style={{ textAlign: 'center', margin: 'auto', boxShadow: 'none !important', borderRadius: 'none' }}>
        <AccordionSummary
          style={{ width: '100%', boxShadow: 'none !important', }}
          className={`${classes.accordionSummary} summary ${props.isAgency && "agencyMenu"}`}
          expandIcon={<ExpandMoreIcon className='exapnd' />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          {icon && <Icon
            icon={`${icon}#${iconId}`}
            color={theme.type === "light" ? "#000" : "#fff"}
            width={24}
            height={22}
            style={{ width: "5.130vw" }}
            class="expand"
            alt="wallet_icon"
            // 0 0 16 17
            viewBox={viewBox}
          />}
          <Typography style={{ color: theme.type === "light" ? "#000" : "#fff", fontFamily: !props.isMoreMenu && "Roboto" }} className={`${classes.heading} heading`}>{children}</Typography>
        </AccordionSummary>
        {
          items &&
          items.map((item) => (
            <AccordionDetails className={`${props.activeTab === item.url ? "menulabel" : item.active ? "selectlable" : ""}`} style={{ float: 'left', display: `${item.isCreator ? '' : 'none'}` }} onClick={item.onClick ? () => handleOpenDrawer(item.onClick) : () => handleRedirect(item.url)}>
              {item.icon && <Icon
                icon={`${item.icon}#${item.iconId}`}
                color={theme.type === "light" ? "#000" : "#fff"}
                width={item.width}
                height={item.height}
                style={item.style}
                alt={item.alt}
                viewBox={item.viewBox}
              />}
              {
                item.log && <img src={item.log} width="30px" height="30px"
                  contextMenu={handleContextMenu}
                  className='callout-none'
                />
              }
              <Typography className={`lableClass ${item.active && "labelactive"}`} style={{ marginLeft: !props.isMoreMenu && '15px', color: theme.type === "light" ? "#000" : "#fff", fontFamily: !props.isMoreMenu && "Roboto" }}>
                {item.label}
              </Typography>
            </AccordionDetails>
          ))
        }
      </Accordion>
      <style jsx>
        {`
            :global(.MuiAccordion-root) {
              background: var(--l_profileCard_bgColor) !important;
            }
            :global(.MuiAccordionSummary-expandIcon) {
                color: ${theme.type === "light" ? "#000" : '#fff'} !important;
            }
            :global(.MuiAccordionSummary-root) {
                padding: 0px 0px;
            }
            :global(.MuiAccordionSummary-content) {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            :global(.MuiAccordionDetails-root) {
                display: flex;
                align-items: center;
            }
            :global(.MuiCollapse-wrapperInner) {
              background: var(--l_profileCard_bgColor) !important;
            }
          `}
      </style>
    </div>
  );
}