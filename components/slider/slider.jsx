import React from "react";
import Slider from "react-slick";

// default setting to apply to sliders
const defaultSettings = {
  dots: true,
  infinite: true,
  arrows: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

// slider component returning the react sliders
const CustomSlider = props => {
  let { settings, className} = props;
  settings = settings || defaultSettings;
  return <Slider {...settings} className={className}>{props.children}</Slider>;
};

export default CustomSlider;
