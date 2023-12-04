import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const BackdropComponent = () => {
  const [isMount, setMount] = useState();

  useEffect(() => {
    setMount(true);
  }, []);

  const Backdrop = (
    <div
      className="player-blackdrop"
      onClick={(e) => {
        e && e.stopPropagation();
      }}
    ></div>
  );
  return isMount ? ReactDOM.createPortal(Backdrop, document.body) : "";
};

export default BackdropComponent;
