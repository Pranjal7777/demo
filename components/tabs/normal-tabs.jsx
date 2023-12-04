// Main React Components
import React, { Component } from "react";
// Prop-Type Checker
import PropTypes from "prop-types";
// materail-UI Components
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
// asstes and colors
import {
  THEME_COLOR,
  Border_LightGREY_COLOR,
  FONTGREY_COLOR,
  BLACK_COLOR
} from "../../lib/config";

function TabContainer(props) {
  return <Typography component="div">{props.children}</Typography>;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabLabel: {
    fontSize: "16px",
    padding: "0 0 10px 0",
    textTransform: "capitalize",
    minWidth: "50px",
    fontWeight: "600",
    color: `${BLACK_COLOR}`,
    opacity: "0.7",
    "&:focus, &:active": {
      outline: "none",
      color: `${THEME_COLOR}`
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "11px"
    }
  },
  indicator: {
    background: `${THEME_COLOR}`,
    top: "34px"
  },
  flexContainer: {
    borderBottom: `1px solid ${Border_LightGREY_COLOR}`,
    maxHeight: "35px"
  },
  selected: {
    color: `${THEME_COLOR}`
  }
});

class NormalTabs extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, tabs, tabContent } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <div className="d-flex">
          <Tabs
            value={value}
            onChange={this.handleChange}
            classes={{
              indicator: classes.indicator,
              flexContainer: classes.flexContainer
            }}
          >
            {tabs.map((tab, key) => (
              <Tab
                key={key}
                className={classes.tabLabel}
                label={tab.label}
                classes={{
                  selected: classes.selected
                }}
              />
            ))}
          </Tabs>
        </div>
        {tabContent.map((tabContent, key) =>
          key === value ? (
            <TabContainer key={key}>{tabContent.content}</TabContainer>
          ) : (
            ""
          )
        )}
      </div>
    );
  }
}

NormalTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default withStyles(styles)(NormalTabs);
