import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

function getModalStyle(width, height) {
  const top = 50;
  const left = 50;
  return {
    // width: props,
    top: `${top}%`,
    left: `${left}%`,
    borderRadius: "5px",
    transform: `translate(-${top}%, -${left}%)`,
    // height: '28.10vw',
    height: `${height}`,
    overflow: 'auto',
    width: `${width}`
  };
}

const styles = (theme) => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
    fontFamily: "Product Sans",
  },
});

class MAT_UI_Modal extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.isOpen || false}
          onClose={this.props.handleClose}
        >
          <div style={getModalStyle(this.props.width, this.props.height)} className={classes.paper}>
            {this.props.children}
          </div>
        </Modal>
      </div>
    );
  }
}

MAT_UI_Modal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const _MAT_UI_Modal = withStyles(styles)(MAT_UI_Modal);

export default _MAT_UI_Modal;
