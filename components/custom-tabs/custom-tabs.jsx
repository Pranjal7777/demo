import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import { WHITE_COLOR, THEME_COLOR } from "../../lib/config";
import {
  SORT_ASC_Q,
  SORT_DESC_Q,
  SORT_RECENT_Q,
  SORT_Q
} from "../../fixtures/filters/filter-params";

function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{
        padding: "20px 13px",
        marginTop: "2px",
        paddingBottom: "0"
        // background: WHITE_COLOR
      }}
    >
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
    width: "100%"
    // backgroundColor: "#fff"
  },
  tabsRoot: {
    // borderBottom: "1px solid #e8e8e8",
    // minHeight: "100vh"
    overflow: "hidden",
    paddingLeft: "10px",
    height: "50px",
    paddingBottom: "12px"
  },
  tabsIndicator: {
    backgroundColor: THEME_COLOR
  },
  tabRoot: {
    textTransform: "initial",
    // minWidth: 100,
    fontWeight: theme.typography.fontWeightRegular,
    padding: 0,
    minHeight: 40,
    // marginRight: theme.spacing.unit * 4,
    textAlign: "left",
    // width: 110,
    marginRight: 10,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: "#2874f0",
      opacity: 1
    },
    "&:focus": {
      color: "#2874f0",
      outline: "none"
    }
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3
  }
});

class CustomTabs extends React.Component {
  state = {
    value: 1,
    isRendered: false
  };

  handleChange = (event, value) => {
    value != this.state.value
      ? this.setState({ value }, () => {
          this.props.triggerOnChange ? this.props.onTabChange(value) : ""; // if we want to trigger any function on tab change, need to pass true in "triggerOnChange" prop
        })
      : "";
  };

  componentDidMount = () => {
    const { selectedURLFilters } = this.props;

    let isAnySelectedFilter = false;

    selectedURLFilters &&
      selectedURLFilters.map(item => {
        isAnySelectedFilter =
          item.key == SORT_Q
            ? item.value[0] == SORT_RECENT_Q
              ? 1
              : item.value[0] == SORT_ASC_Q
              ? 2
              : item.value[0] == SORT_DESC_Q
              ? 3
              : false
            : false;
      });
    this.setState({ isRendered: true, value: isAnySelectedFilter || 1 });
  };

  render() {
    const { classes, TabLabels, TabContent, TabTitle, hideTabs } = this.props;
    const { value, isRendered } = this.state;

    return (
      <div className={classes.root} style={{ overflow: "hidden" }}>
        {isRendered ? (
          <AppBar
            position="static"
            color="default"
            style={{ background: "#fff", boxShadow: "none" }}
          >
            {hideTabs ? (
              ""
            ) : (
              <Tabs
                value={value}
                onChange={this.handleChange}
                style={{ height: 41 }}
                classes={{
                  root: classes.tabsRoot,
                  indicator: classes.tabsIndicator
                }}
              >
                {TabLabels &&
                  TabLabels.map((label, index) => (
                    <Tab
                      label={label}
                      // buttonStyle={{ height: 30 }}
                      classes={{ root: classes.tabRoot }}
                      style={{
                        color: label === TabTitle ? "#222" : "",
                        fontWeight: index === value ? 600 : 500,
                        // padding: 0
                        height: "30px",
                        color: index === value ? THEME_COLOR : "inherit",
                        minWidth: label === TabTitle ? 72 : 70
                      }}
                      key={"uiTabs-" + index}
                      disabled={label === TabTitle}
                    />
                  ))}
              </Tabs>
            )}
          </AppBar>
        ) : (
          ""
        )}

        <TabContainer
          classes={{
            root: classes.tabsRoot
          }}
        >
          <div
            className="row"
            style={{
              overflow: "hidden",
              marginTop: "-20px"
              //   background: WHITE_COLOR
            }}
          >
            {TabContent}
          </div>
        </TabContainer>
      </div>
    );
  }
}

export default withStyles(styles)(CustomTabs);
