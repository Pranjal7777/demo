import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * @description use this for dynamic svg icon
 * @author jagannath
 * @date 24/05/2021
 * @param icon: svg image path
 * @param color
 * @param hoverColor
 * @param width
 * @param height
 * @param size
 * @param unit
 * @param class
 * @param style
 */
const Icon = (props) => {
  const [ishovered, setHover] = useState(false);
  const styles = {
    svg: {
      display: "inline-block",
      verticalAlign: "middle",
      "&:hover, &:focus": {
        fill: props.hoverColor,
      },
    },
    path: {
      fill: props.color,
    },
  };

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <div
      className={`${props.class}`}
      style={props.style}
      onClick={props.onClick}
    >
      <svg
        style={styles.svg ? styles.svg : {}}
        width={`${props.width || props.size}${props.unit || "px"}`}
        height={`${props.height || props.size}${props.unit || "px"}`}
        viewBox={props.viewBox || "0 0 27.941 27.900"}
        fill={
          ishovered
            ? props.hoverColor
              ? props.hoverColor
              : props.color
            : props.color
        }
        color={
          ishovered
            ? props.hoverColor
              ? props.hoverColor
              : props.color
            : props.color
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <use
          xlinkHref={props.icon}
          width={props.useWidth || "100%" || `${props.size}px`}
          height={props.useHeight || "100%" || `${props.size}px`}
        />
      </svg>
    </div>
    // <svg
    //   style={styles.svg}
    //   width={`${props.size}px`}
    //   height={`${props.size}px`}
    //   //viewBox="0 0 1024 1024"
    // >
    //    <path style={styles.path} d={props.icon} />
    // </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: 16,
};

export default Icon;
