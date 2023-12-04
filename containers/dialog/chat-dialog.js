import React from "react";
//material ui dialog component
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
//material ui dialog content
import DialogContent from "@material-ui/core/DialogContent";
import Confirmation from "./confirmDialog/confirmDialog";
import ChatShare from "./chatShare/chatShare";
import RecoverWarningDialog from "./recoverWarning/recoverWarningDialog";
import SuccessOnly from "./successOnly/successOnly";
import Loadings from "./Loadings/loadings";
import AttachedFile from "./attachedFIleDialog/attachedFileDialog";

const styles = {
  root: {
    padding: "0px !important",
    overflowX: "hidden",
  },
  outerBox: {
    borderRadius: "8px !important",
    margin: "5px",
  },
};

const ModalDialog = (props) => {
  // console.log("propspropsprops",props)
  let dialogContent = null;
  let { classes } = props;
  switch (props.type) {
    case "chatShare":
      //   //unsubscribeDilog
      dialogContent = (
        <ChatShare
          {...props.dialogData}
          handlerDialog={props.handlerDialog}
          onClose={props.handleClose}
        />
      );
      break
    case "recoverWarningDialog":
      //change password
      dialogContent = (
        <RecoverWarningDialog
          handleClose={props.handleClose}
          {...props.dialogData}
        />
      );
      break;
    case "confirmDialog":
      dialogContent = (
        <Confirmation
          {...props.dialogData}
          handlerDialog={props.handlerDialog}
          onClose={props.handleClose}
        />
      );
      break;
    case "successOnly":
      dialogContent = (
        <SuccessOnly
          {...props.dialogData}
          handlerDialog={props.handlerDialog}
          onClose={props.handleClose}
        />
      );
      break;

    case "loading":
      dialogContent = (
        <Loadings
          {...props.dialogData}
          handlerDialog={props.handlerDialog}
          onClose={props.handleClose}
        />
      );
      break;

    case "attachedFile":
      dialogContent = (
        <AttachedFile
          {...props.dialogData}
          handlerDialog={props.handlerDialog}
          onClose={props.handleClose}
        />
      )
      break;

    default:
      dialogContent = (
        <div>Chat Share Dialog Not Found</div>
      )
      break;
  }

  return (
    //dialog component
    <Dialog
      test="dialog"
      open={props.open}
      className={`${classes.outerBox} mu-dialog`}
      onClose={props.handleClose}
      disableBackdropClick={props.disableBackdropClick || false}
      classes={{
        paper: classes.outerBox,
      }}
      {...props.dialogModel}
    >
      <DialogContent test="DialogContent" className={classes.root}>
        {dialogContent}
      </DialogContent>

      <style jsx>{`
        :global(.mu-dialog > div > div) {
          overflow-y: visible !important;
        }
        :global(.mu-dialog > div > div) {
          max-width: 100vw !important;
        }
        :global(.mu-dialog) {
          margin: 11px !important;
        }

        @media only screen and (max-width: 767px) {
          :global(.mu-dialog > div > div) {
            max-width: 90vw !important;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default withStyles(styles)(ModalDialog);
