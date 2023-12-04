import React, { useEffect, useState } from "react";
const ScrollTopEvent = props => {
  const [closeEvent, setCloseEvent] = useState(null);
  const [openEvent, setOpenEvent] = useState(null);

  useEffect(() => {
    const elem = document.getElementById("home-page");

    elem?.addEventListener("scroll", () => {
      const elemn = document.getElementById("home-page");
      if (elemn.scrollTop < 10) {
        setCloseEvent(Math.random());
      }
      if (elemn.scrollTop > 50 && elem.scrollTop < 200) {
        setOpenEvent(Math.random());
      }
    });
  }, []);

  useEffect(() => {
    if (closeEvent) {
      props.scrollerEvent && props.scrollerEvent(false);
    }
  }, [closeEvent]);

  useEffect(() => {
    if (openEvent) {
      props.scrollerEvent && props.scrollerEvent(true);
    }
  }, [openEvent]);

  return <div />;
};

export default ScrollTopEvent;
