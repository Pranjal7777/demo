import React from "react";
import Image from "./image";

const FigureImage = (props) => {
  const { fclassname, cssStyles, ...others } = props;
  return (
    <figure
      className={`${fclassname}`}
      style={{ ...cssStyles }}
    >
      <Image {...others} />
    </figure>
  );
};

export default FigureImage;
