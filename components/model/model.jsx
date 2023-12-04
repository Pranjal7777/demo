import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CancelIcon from "@material-ui/icons/Cancel";
class Model extends React.Component {
  render() {
    const {
      open,
      onClose,
      children,
      fullScreen,
      fullWidth,
      closeIcon,
      ...others
    } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        {...others}
        fullScreen={fullScreen || false}
        fullWidth={fullWidth || false}
      >
        {closeIcon ? (
          <CancelIcon onClick={onClose} className="close_icon" />
        ) : (
          <></>
        )}
        {children}
      </Dialog>
    );
  }
}

export default Model;
