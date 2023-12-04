import React from "react";

const Video = (props) => {
  const { src, className, type, height, width } = props;

  return (
    <div className="videoBlock">
      <video
        className={className}
        height={height || "auto"}
        width={width || "auto"}
        autoplay
        controls
        controlsList="nodownload"
      >
        <source src={src} type={type} />
      </video>
    </div>
  );
};

export default Video;
