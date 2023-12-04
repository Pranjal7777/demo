import React, { useEffect } from "react";
import parse from "html-react-parser";
import { linkify } from "../../lib/global/linkify";
import isMobile from "../../hooks/isMobile";

const ShowMore = (props) => {
  // console.log("props", props);
  const [parsedText, setParsedText] = React.useState("");
  const [mobileView] = isMobile();
  const {
    text,
    count = mobileView ? 100 : 200,
    className,
  } = props;
  // console.log("textttttttttt", text, text.length);
  // console.log("count", count);

  React.useEffect(() => {
    moreText(text, true);
  }, [text]);

  const moreText = (text, flag) => {
    // console.log(flag);
    if (!text || text.length <= count || !flag) {
      setParsedText(text);
    } else {
      let nText = [...text].splice(0, count - 10).join("");
      setParsedText(nText);
    }
  };

  useEffect(() => {
    if (parsedText) {
      if (props.onChange) {
        props.onChange(parsedText);
      }
    }
  }, [parsedText])

  return (
    <React.Fragment>
      <span
        style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
        className={className}>
        {parse(linkify(parsedText))}
        {text &&
          text.length > count &&
          (parsedText.length > count ? (
            <a
              onClick={() => moreText(text, true)}
              className="cursorPtr">
              {" "}
              ...Show Less
            </a>
          ) : (
            <a
              onClick={() => moreText(text, false)}
              className="cursorPtr">
              {" "}
              ...Show More
            </a>
          ))}
      </span>
    </React.Fragment>
  );
  // return (
  //     <ShowMoreText
  //         lines={lines || 3}
  //         more={more || 'View more'}
  //         less={less || 'View less'}
  //         className={`content-css ${className ? className : ''}`}
  //         anchorClass={`my-anchor-css-class ${anchorClass?anchorClass:''}`}
  //         expanded={expand || false}
  //         width={width || 0}
  //     >
  //        {textData}
  //     </ShowMoreText>
  // );
};
export default ShowMore;
