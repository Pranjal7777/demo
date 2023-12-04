import React, { useRef, useEffect } from "react";

function useOutsideAlerter(ref, props) {
  /**
   * Alert if clicked on outside of element
   */
  function handleClickOutside(event) {
    if (
      ref.current &&
      !ref.current.contains(event.target)
    ) {
      props.onClose();
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  });
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);

  return <div ref={wrapperRef}>{props.children}</div>;
}


export default OutsideAlerter;
