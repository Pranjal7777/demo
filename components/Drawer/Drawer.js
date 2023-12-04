import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

const styles = {
  list: {
    width: 400,
  },
};

class MainDrawer extends React.Component {
  render() {
    return (
      <div>
        <Drawer
          open={this.props.open}
          onOpen={this.props.onOpen}
          onClose={this.props.onClose}
          anchor={this.props.anchor || "right"}
        >
          <div tabIndex={0} role="button" onClose={this.props.onClose}>
            {this.props.children}
          </div>
        </Drawer>
      </div>
    );
  }
}

MainDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainDrawer);
