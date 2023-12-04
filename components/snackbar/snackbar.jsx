import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { snakbar } from "../../lib/rxSubject";
const MuiSnackbar = dynamic(() => import("./muiSnackbar"));

export default function CustomizedSnackbars() {
  const [isPageloaded, setPageLoaded] = useState();
  const [open, setOpen] = React.useState({
    open: false,
    message: "",
    veriant: "success",
    duration: 2000
  });

  useEffect(() => {
    const snak = snakbar.subscribe((data) => {
      let stateObject = { ...open };
      stateObject.open = true;
      stateObject.message = data.message || "";
      stateObject.veriant = data.type || "success";
      stateObject.duration = data.duration || 2000
      setOpen(stateObject);
    });
    setPageLoaded(true);
    return () => {
      return snak && snak.unsubscribe();
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    let stateObject = { ...open };
    stateObject.open = false;
    setOpen(stateObject);
  };

  return (
    <div >
      {open.message && (
        <MuiSnackbar open={open} handleClose={handleClose} />
      )}
    </div>
  );
}
