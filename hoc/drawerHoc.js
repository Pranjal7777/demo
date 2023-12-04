import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { startLoader, stopLoader } from "../lib/global/loader";
const Drawer = dynamic(() => import("../containers/drawer/drawer"), {
  ssr: false,
  loading: () => {
    useEffect(() => {
      startLoader()
      return () => {
        stopLoader()
      }
    }, [])
    return <div></div>
  }
});
import { DrawerClose, DrawerOpen } from "../lib/rxSubject";
class DrawerHoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawer: {
        // open: false,
        // type: "",
        // anchor: "left",
        // drawerData: {},
        // drawerModel: {},
      },
    };

  }

  componentDidMount() {
    DrawerOpen.subscribe((...params) => this.open_drawer(...params[0]));
    DrawerClose.subscribe((...params) => this.close_drawer(...params[0]));
  }

  open_drawer = (type, drawerData = {}, anchor = "left", drawerModel = {}) => {
    // console.log("open_drawer", type, drawerData);
    this.setState(
      {
        ...this.state,
        drawer: {
          ...this.state.drawer,
          [type]: {
            open: false,
            anchor: anchor || "left",
            type: type,
            drawerData: drawerData || {},
            drawerModel: drawerModel || {},
          },
        },
      },
      () => {
        setTimeout(() => {
          this.setState({
            ...this.state,
            drawer: {
              ...this.state.drawer,
              [type]: { ...this.state.drawer[type], open: true },
            },
          });
        }, 20);
      }
    );
  };

  close_drawer = (type = "") => {
    let stateObject = { ...this.state };
    // console.log("close_drawer 2", type);
    let darwerData = { ...stateObject.drawer };
    if (darwerData[type]) {
      darwerData[type]["open"] = false;
    } else {
      // Object.keys(darwerData).map((type) => {
      //   darwerData[type]["open"] = false;
      // });
    }
    this.setState(
      {
        ...this.state,
        drawer: darwerData,
      },
      () => {
        if (type) {
          delete darwerData[type];
        } else {
          darwerData = {};
        }

        setTimeout(() => {
          this.setState({
            ...this.state,
            drawer: darwerData,
          });
        }, 30);
      }
    );
  };

  render() {
    return Object.values(this.state.drawer).map((drawer, index) => {
      // return <div>Drawer data</div>;
      // console.log("ASDads", drawer);
      return (
        <Drawer
          key={index}
          disableBackdropClick={
            (drawer.drawerData && drawer.drawerData.disableBackdropClick) ||
            false
          }
          open={drawer.open}
          type={drawer.type}
          handleClose={(type = "") => {
            type = typeof type == "string" ? type : "";
            this.close_drawer(type);
            drawer.drawerData &&
              drawer.drawerData.handleClose &&
              drawer.drawerData.handleClose(null);
          }}
          anchor={drawer.anchor}
          handlerDialog={this.open_drawer}
          drawerData={drawer.drawerData}
        />
      );
    });
  }
}

export default DrawerHoc;
