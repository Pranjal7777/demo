import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Wrapper from "../../hoc/Wrapper";
import Slider from "@material-ui/core/Slider";
import { useTheme } from "react-jss";
import isMobile from "../../hooks/isMobile";
import { close_drawer } from "../../lib/global";
import useLang from "../../hooks/language";
import CheckboxLabels from "../../containers/UserCategories/filterGroup/checkRadioGroup";

const useStyles = (props) =>
makeStyles({
  root: {
    width: 180,
    "& .MuiSlider-thumb": {
      width: "16px",
      height: "16px",
      marginTop: "-7px",
    },
    "& .MuiSlider-rail": {
      background: props?.theme?.priceSliderBg,
    },
    "& .MuiSlider-thumb": {
      background: props?.theme?.priceSliderPointBg,
      border: `1px solid ${props?.theme?.text}`,
      width: "16px",
      height: "16px",
      marginTop: "-7px",
    },
    "& .MuiSlider-track": {
      background: `${props?.theme?.priceSliderBg} !important`,
    },
  },
});

const InputRanges = (props) => {
  const {
    maxValue = 1000,
    minShoutoutValue = 0,
    sortByPrice,
    filterType = "",
    handleCheckboxValue,
    checkboxList,
    labelPlacement = "end",
    handleState,
    handleInnerRange
  } = props;

  const theme = useTheme();
  const [value, setValue] = useState([minShoutoutValue, maxValue]);
  const [lang] = useLang();
  const classes = useStyles({ theme: theme })();
  const [mobileView] = isMobile();

  useEffect(()=>{
    setValue([minShoutoutValue, maxValue]);
  }, [minShoutoutValue])
  
  const handleChange = (event, newValue = 0) => {
    setValue(prev=>prev=newValue);
    props?.handleRange(newValue);
    props?.handleInnerRange && props?.handleInnerRange(true)
  };

  const handleSliderValue = (e, from = true) => {
    let sliderValue = e.target.value;
    if(from){
      setValue([sliderValue, value[1]]);
      props?.handleRange && props?.handleRange([sliderValue, value[1]]);
    }else{
      setValue([value[0], sliderValue]);
      props?.handleRange && props?.handleRange([value[0], sliderValue]);
    }
  };

  return (
    <Wrapper>
      <div className={classes.root}>
        <CheckboxLabels
          handleCheckboxValue={handleCheckboxValue}
          checkboxList={mobileView ? checkboxList : sortByPrice}
          labelPlacement={labelPlacement}
          filterType={filterType}
          handleState={handleState}
        />
        <Slider
          value={value}
          onChange={handleChange}
          min={0}
          className={classes.root}
          max={1000}
          aria-labelledby="range-slider"
          valueLabelDisplay="off"
        />
        <div className="d-flex justify-content-between align-items-center pt-2">
          <input
            className="sliderDivCss appTextColor text-center fntSz12 col-5 py-1"
            onChange={(e) => handleSliderValue(e, true)}
            value={value[0]}
          />
          <div>{lang.rangeTo}</div>
          <input
            className="sliderDivCss appTextColor text-center fntSz12 col-5 py-1"
            onChange={(e) => handleSliderValue(e, false)}
            value={value[1]}
          />
        </div>
      </div>
      <style jsx>{`
        .sliderDivCss {
          border: 1px solid ${mobileView ? theme?.labelbg: theme?.labelbg};
          border-radius: 6px;
          background: ${mobileView ? theme?.labelbg: theme.type == "light" ? theme.palette.white : theme.palette.d_black};
        }
      `}</style>
    </Wrapper>
  );
};

export default InputRanges;
