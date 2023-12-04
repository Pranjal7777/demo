import React, { useEffect, useState } from "react";
const around = (n, value) => {
  return value >= n - 5 && value <= n + 5;
};
/**
 * @description this is a component to get pagination event
 * if scroll height of a container is equal to scrollTop & clientHeight
 * then this component will raise an event provided in props (pageEventHandler)
 * provide the html element id of scrollable container (make sure that element exists in View Port)
 * @author Jagannath
 * @date 2021-01-18
 * @param {props: id: HTMLElement, totalData: Array[], totalCount: Number}
 * @param {event: pageEventHandler: f()}
 */
const PaginationIndicator = (props) => {
  const {
    id,
    totalData,
    totalCount,
    pageEventHandler,
    elementRef,
    offset = 0,
    ...others
  } = props;
  const [pageChange, setPageChange] = useState(0);

  useEffect(() => {
    const elementNode =
      document.getElementById(id) || (elementRef && elementRef.current);
    if (elementNode) {
      elementNode.addEventListener("scroll", () => {
        let isScrollTouchingBottom;
        if (props.popularPost) {
          isScrollTouchingBottom = parseInt(elementNode.scrollTop) + parseInt(elementNode.clientHeight) > (parseInt(elementNode.scrollHeight) - 3000)
        } else {
          if (offset) {
            isScrollTouchingBottom = parseInt(elementNode.scrollTop) + parseInt(elementNode.clientHeight) >= (parseInt(elementNode.scrollHeight) - offset)
          } else {
            isScrollTouchingBottom = around(
              parseInt(elementNode.scrollHeight) - offset,
              parseInt(elementNode.scrollTop) + parseInt(elementNode.clientHeight)
            );
          }
        } 

        if (isScrollTouchingBottom && parseInt(elementNode.scrollTop)) {
          setPageChange(Math.random());
        }
      }, { passive: true });
    }
  }, []);
  useEffect(() => {
    const elementNode =
      document.getElementById(id) || (elementRef && elementRef.current);
    if (elementNode && props.checkHeight) {
      if (totalData.length && elementNode.clientHeight >= elementNode.scrollHeight) {
        pageEventHandler(true);
      }
    }
  }, [totalData, props.checkHeight])
  useEffect(() => {
    const elementNode =
      document.getElementById(id) || (elementRef && elementRef.current);
    if (elementNode && pageChange) {
      let isScrollTouchingBottom;
      if (props.popularPost) {
        isScrollTouchingBottom = parseInt(elementNode.scrollTop) + parseInt(elementNode.clientHeight) > (parseInt(elementNode.scrollHeight) - 3000)
      } else {
        if (offset) {
          isScrollTouchingBottom = parseInt(elementNode.scrollTop) + parseInt(elementNode.clientHeight) > (parseInt(elementNode.scrollHeight) - offset)
        } else {
          isScrollTouchingBottom = around(
            parseInt(elementNode.scrollHeight),
            parseInt(elementNode.scrollTop) + parseInt(elementNode.clientHeight)
          );
        }
      }
      if (isScrollTouchingBottom) {
        if (totalData && totalCount && totalData.length < totalCount) {
          pageEventHandler && pageEventHandler(true);
        } else {
          pageEventHandler && pageEventHandler(false);
        }
      }
    }
  }, [pageChange]);

  useEffect(() => {
    return () => {
      const elementNode =
        document.getElementById(id) || (elementRef && elementRef.current);
      if (elementNode) {
        elementNode.removeEventListener("scroll", () => null);
      }
    };
  }, []);
  return <div {...others}>{props.children}</div>;
};
export default PaginationIndicator;
