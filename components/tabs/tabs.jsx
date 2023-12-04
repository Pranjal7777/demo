// Main React Components
import React from "react";

// Material UI Components
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { Badge } from "@material-ui/core";
import { palette } from "../../lib/palette";

// import { FONT_FAMILY } from "../../lib/config";

function TabContainer(props) {
  return <Typography component="div" style={{ height: "100%" }}>{props.children}</Typography>;
}


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  tabsRoot: {
    borderBottom: `${theme.type === "light" ? '1px solid rgb(206 214 230)' : '1px solid var(--l_input_bg)'}`,
    backgroundColor: "transparent"
  },
  tabsIndicator: {
    backgroundColor: `${palette.l_base}`
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: 72,
    fontWeight: "bold",
    marginLeft: 0,
    marginRight: 0,
    fontSize: "10px",
    // fontFamily: FONT_FAMILY,
    color: "#787878",
    "&$tabSelected": {
      borderBottom: `3px solid ${palette.l_base}`,
      color: `${palette.l_base}`,
      fontWeight: "bold",
      outline: "none",
      fontSize: "10px"
    },
    "&:focus": {
      color: `${palette.l_base}`
    }
  },
  tabSelected: {},
  typography: {
    padding: "10px"
  }
});

// const styles = theme => ({
//   root: {
//     flexGrow: 1
//   },
//   tabsRoot: {
//     borderBottom: `1px solid ${palette.l_grey_border}`,
//     backgroundColor: "transparent"
//   },
//   tabsIndicator: {
//     backgroundColor:  `${palette.l_base}`
//   },
//   tabRoot: {
//     textTransform: "initial",
//     minWidth: 72,
//     fontWeight: "bold",
//     marginLeft:theme.spacing.unit * 4,
//     marginRight: theme.spacing.unit * 4,
//     fontSize: "15px",
//     // fontFamily: FONT_FAMILY,
//     color: "#787878",
//     "&$tabSelected": {
//       borderBottom : `3px solid ${palette.l_base}`,
//       color: `${palette.l_base}`,
//       fontWeight: "bold",
//       outline: "none",
//       fontSize: "15px"
//     },
//     "&:focus": {
//       color: `${palette.l_base}`
//     }
//   },
//   tabSelected: {},
//   typography: {
//     padding: "10px"
//   }
// });

class SimpleTabs extends React.Component {
  state = {
    value: this.props.activeTab || 0,
  };

  handleChange = (event, value) => {
    this.props.handleChange?.(value)
    this.setState({ value });

  };

  getUnreadCount = (sale, index) => {
    if (!Object.keys(sale) || !Object.keys(sale).length) return
    if (index) {
      return Object.keys(sale)
        .map(item => sale[item])
        .filter(item => !item.type && item.totalUnread)
        .length
    } else {
      return Object.keys(sale)
        .map(item => sale[item])
        .filter(item => item.type && item.totalUnread)
        .length
    }
  }

  render() {
    const { classes, tabs, tabContent, tabMaxWidth = "160px", tabLabelStyle = {} } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root} style={{ height: "100%", width: '100%' }}>
        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{
            root: classes.tabsRoot,
            indicator: classes.tabsIndicator
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              classes={{
                root: classes.tabRoot,
              }}
              style={tabLabelStyle}
              label={
                this.props.badge
                  ? index === 2
                    ? <label className="mv_tab_label cursorPtr">{tab.label}</label>
                    : <Badge
                      variant="dots"
                      max={100}
                      classes={{
                        anchorOriginTopRightRectangle: "tab_badge"
                      }}
                      badgeContent={this.getUnreadCount(this.props.sale, index)}
                      color="secondary">
                      <label className="mv_tab_label">{tab.label}</label>
                    </Badge>
                  : tab.label
              }
              className="col"
            />
          ))}
        </Tabs>

        <Typography className={classes.typography + "m-0 w-100 dynamicHeighttab"} style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 185px)" }}>
          {tabContent.map((tabContent, key) => {
            return (key === value
              ? <TabContainer className={classes.tabContainer} key={key}>{
                typeof tabContent.content === "function" ? tabContent.content?.() : tabContent.content
              }
                <span>{this.state.normalCount}</span>
              </TabContainer>
              : ""
            )
          }
          )}
        </Typography>
        <style jsx>{`
          :global(.MuiTab-root) {
            max-width: ${tabMaxWidth} !important;
          }
        `}
        </style>
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);