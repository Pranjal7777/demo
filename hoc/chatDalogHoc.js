import React from "react";
import Dialog from "../containers/dialog/chat-dialog";

export default function DialogHoc(CustomComponet) {
  return class dialogHanlder extends React.Component {
    state = {
      dialog: {
        open: false,
        type: "",
        dialogData: {},
        dialogModel: {},
      },
    };

    static getInitialProps(ctx) {
      if (ctx.isServer) {
        // console.log(
        //   "<----------------------------------------------------------------------------------------------------------------------------------------------------->",
        //   JSON.stringify(ctx.req.headers),
        //   "<----------------------------------------------------------------------------------------------------------------------------------------------------->"
        // );
      }

      if (CustomComponet.getInitialProps) {
        return CustomComponet.getInitialProps(ctx);
      }
    }
    // open dialog
    open_dialog = (type, dialogData = {}, dialogModel = {}) => {

      this.setState(
        {
          ...this.state,
          dialog: {
            ...this.state.dialog,
            open: true,
            type: type,
            dialogData: dialogData,
            dialogModel: dialogModel,
          },
        },
        () => {
          // console.log("open_dialog", this.state);
        }
      );
    };

    // close dialog

    close_dialog = (flag = false) => {
      // console.log("close_dialog", flag);
      this.setState({
        ...this.state,
        dialog: {
          ...this.state.dialog,
          open: false,
        },
      });
    };
    render() {
      // console.log("dialog wrapper props", this.props);
      const children = React.Children.map(
        this.props.children,
        (child, index) => {
          return (
            child &&
            React.cloneElement(child, {
              index,
              close_dialog: this.close_dialog,
              open_dialog: this.open_dialog,
            })
          );
        }
      );
      // console.log("this.state.dialog",this.state)
      return (
        <React.Fragment>
          <Dialog
            open={this.state.dialog.open}
            type={this.state.dialog.type}
            handleClose={this.close_dialog.bind(this)}
            handlerDialog={this.open_dialog.bind(this)}
            dialogData={this.state.dialog.dialogData}
            dialogModel={this.state.dialog.dialogModel}
            disableBackdropClick={this.state.dialog.dialogData.disable || false}
          />
          <CustomComponet
            {...this.props}
            open_dialog={this.open_dialog}
            close_dialog={this.close_dialog}
          ></CustomComponet>
        </React.Fragment>
      );
    }
  };
}

// export default DialogHoc;
