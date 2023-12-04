import React, { useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import SelectoreDrawer from "../../containers/drawer/selectore-drawer/selectore-drawer";
import useLang from "../../hooks/language";
import { useRouter } from "next/router";

export default function WalletFilters(props) {
  const [lang] = useLang();
  const router = useRouter();
  const { selectedFilter } = props;

  const handleSelectFilter = (selectedFilter) => {
    props.filterOnSelection(selectedFilter);
    props.onClose();
  };

  return (
    <Wrapper>
      <div className="row m-0 h-100">
        <SelectoreDrawer
          darkgreyBg={true}
          title=""
          value={selectedFilter}
          data={
            props.filters &&
            props.filters.length &&
            props.filters
              .map((data) => ({
                name: "changefilter",
                value: data.value,
                label: data.label,
              }))
              .map((option) => {
                return option;
                ``;
              })
          }
          onSelect={(selectedFilter) => handleSelectFilter(selectedFilter)}
        />
      </div>
      <style jsx>
        {`
          :global(.MuiDialog-paper) {
            color: inherit;
            width: 60vw;
          }
        `}
      </style>
    </Wrapper>
  );
}
