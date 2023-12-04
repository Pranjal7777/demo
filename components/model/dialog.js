import React from "react";
//material ui dialog component
import Dialog from "@material-ui/core/Dialog";
//material ui dialog content
import DialogContent from "@material-ui/core/DialogContent";
import { useRouter } from "next/router";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px !important",
    overflowX: "hidden",
  },
  outerBox: {
    borderRadius: "8px !important",
    margin: "5px",
    minWidth:(theme) => `${theme.pathname == "search" ? `${theme.width} !important` : ""}`
  },
}));

const SimpleDialog = (props) => {
  const params = useRouter();
  let pathname =
  params.pathname == "/[tab]" ? params.query.tab : params.pathname;
  let { dialogData } = props;
  const classes = useStyles({pathname, ...props});

  return (
    //dialog component
    <Dialog
      test="dialog"
      open={props.open}
      className={`${classes.outerBox} mu-dialog`}
      onClose={props.onClose}
      classes={{
        paper: classes.outerBox,
      }}
      disableScrollLock={true}
    >
      <DialogContent test="DialogContent" className={classes.root}>
        <div className="w-100">{props.children}</div>
      </DialogContent>
      <style jsx>{`
        :global(.mu-dialog > div > div) {
          overflow-y: visible !important;
        }
        :global(.mu-dialog) {
          margin: 11px !important;
        }
        :global(.MuiDialog-paper) {
          min-width: 450px;
        }
      
        @media only screen and (max-width: 767px) {
          :global(.mu-dialog > div > div) {
            max-width: 90vw !important;
          }

          :global(.MuiDialog-paper) {
            min-width: auto !important;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default (SimpleDialog);
