// Main React Components
import React from "react";
// Prop-Type Checker
import PropTypes from "prop-types";
// material-ui components
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  primary: {
    fontSize: "12px",
    fontWeight: "bold",
    opacity: "0.8",
    float: "right",
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "12px"
    }
  },
  list: {
    padding: "8px 2px",
    padding: "5px 2px"
  },
  secondary: {
    float: "right",
    margin: "0 5px",
    fontFamily: "Avenir !important",
    letterSpacing: "0.5px !important",
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "11px"
    }
  },
  Chevron: {
    fontSize: "18px",
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "15px"
    }
  }
});

class NestedList extends React.Component {
  render() {
    const { classes, name, subname, open, onClick } = this.props;

    return (
      <List component="nav" className={classes.root}>
        <ListItem onClick={onClick} button className={classes.list}>
          <ListItemText
            primary={name}
            classes={{ root: classes.fontFamily, primary: classes.primary }}
          />
          <ListItemText
            secondary={subname}
            classes={{ secondary: classes.secondary }}
          />
          {open ? (
            <ExpandLess className={classes.Chevron} />
          ) : (
            <ExpandMore className={classes.Chevron} />
          )}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {this.props.children}
        </Collapse>
      </List>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);
