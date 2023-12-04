import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ProgressLoader } from "../lib/rxSubject";
const LinearProgress = dynamic(() => import("@material-ui/core/LinearProgress"));

const ProgressBar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    ProgressLoader.subscribe((flag) => setOpen(flag));
  }, []);
  
  return (
    <div
      style={{ position: "fixed", zIndex: 1000000, top: 0, width: "100%" }}
    >
      {open ? <LinearProgress className="click_event_loader" color="primary" /> : <></>}
      
    </div>    
  );
};
export default ProgressBar;
