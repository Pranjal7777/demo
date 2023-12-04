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
  return <Typography component="div">{props.children}</Typography>;
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  tabsIndicator: {
    backgroundColor: `${palette.l_base}`
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: 72,
    fontWeight: "400",
    marginLeft: 0,
    marginRight: 0,
    fontSize: "10px",
    borderBottom: `1px solid var(--l_border)`,
    // fontFamily: FONT_FAMILY,
    "&:focus": {
      color: `${palette.l_base}`
    }
  },
  tabSelected: {
    borderBottom: `2px solid ${palette.l_base}`,
    color: `${palette.l_base}`,
    outline: "none",
    fontSize: "10px",
  },
  typography: {
    padding: "10px"
  }
});

class SimpleTabs extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.props.handleChange?.(value)
    this.setState({ value });
  };

  getUnreadCount = (sale = {}, index = 0) => {
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
    const { classes, tabs, tabContent } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
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
                selected: classes.tabSelected
              }}
              label={this.props.badge
                ? index === 2
                  ? <label className="mv_tab_label cursorPtr">{tab.label}</label>
                  : <Badge
                    variant="dots"
                    max={100}
                    classes={{ anchorOriginTopRightRectangle: "tab_badge" }}
                    badgeContent={this.getUnreadCount(this.props.sale, index)}
                    color="secondary">
                    <label className="mv_tab_label cursorPtr">{tab.label}</label>
                  </Badge>
                : tab.label
              }
              className="col"
            />
          ))}
        </Tabs>
        <Typography className={classes.typography + "m-0 w-100"}>
          {tabContent.map((tabContent, key) =>
            key === value
              ? <TabContainer key={key}>{tabContent.content}</TabContainer>
              : ""
          )}
        </Typography>
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
