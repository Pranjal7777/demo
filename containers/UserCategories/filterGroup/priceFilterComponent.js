import React from "react";
import InputRanges from "../../../components/input-range-picker-comp/input-range-picker";
import CheckboxLabels from "./checkRadioGroup";

const PriceFilterComponent = (props) => {
  const { checkboxList, handleRange, maxValue, minValue, minShoutoutValue } = props;
  return (
    <div>
      <div className="py-2">
        <InputRanges
          handleRange={handleRange}
          minValue={minValue}
          maxValue={maxValue}
          minShoutoutValue={minShoutoutValue}
        />
      </div>
    </div>
  );
};

export default PriceFilterComponent;
