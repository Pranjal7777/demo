import React, { useState } from "react";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
import Wrapper from "../../hoc/Wrapper";
import { P_CLOSE_ICONS } from "../../lib/config";
import FilterRadioGroup from "../../containers/UserCategories/filterGroup/filterRadioGroup";
import Icon from "../image/icon";

const SortUsersByCategory = (props) => {
  const { radioOptionList, radioLabel, setFilterValue, radioValue } = props;
  const [mobileView] = isMobile();
  const theme = useTheme();

  const [sortByFilters, setSortByFilters] = useState([
    { label: "Recommendned", value: "Recommendned" },
    { label: "Price: High", value: "Price: High" },
    { label: "Price: Low - High", value: "Price: Low - High" },
    // { label: "Number of reviews", value: "Number of reviews" },
    { label: "Newest", value: "Newest" },
    { label: "Alphabetics", value: "Alphabetics" },
  ]);

  return (
    <Wrapper>
      <div className="d-flex flex-column col-12 pt-4">
        <div className="d-flex w-100 px-0 justify-content-between align-items-center">
          <h3 className="appTextColor">Sort by</h3>
          <h3 className="appTextColor">
            <Icon
              icon={`${P_CLOSE_ICONS}#cross_btn`}
              height={26}
              width={26}
              color={theme.text}
              alt="back arrow icon"
              onClick={() => props.onClose()}
              class="cursorPtr"
            />
          </h3>
        </div>
        <div className="pt-3">
          <FilterRadioGroup
            labelPlacement="start"
            radioOptionList={radioOptionList}
            setFilterValue={setFilterValue}
            radioClass="pl-0 py-2"
            radioValue={radioValue}
            radioLabel={radioLabel}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default SortUsersByCategory;
