import React from "react";
import { useTheme } from "react-jss";
import VerticalTabs from "../../containers/UserCategories/verticalTabs/verticalTabs";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { P_CLOSE_ICONS } from "../../lib/config";
import Icon from "../image/icon";

const FilterUserByCategories = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  return (
    <Wrapper>
      <div className="pt-2 vh-100">
        <div className="d-flex col-12 p-3 w-100 justify-content-between align-items-center headerBorder">
          <h3 className="appTextColor fntSz26">{lang.filter}</h3>
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
        <div
          className="col-12 px-0 d-flex py-3 appTextColor"
          style={{ maxHeight: "470px", minHeight: "400px" }}
        >
          <VerticalTabs {...props}/>
        </div>
      </div>
      <style jsx>{`
        .headerBorder {
          border-bottom: 1px solid #6a7286 !important;
        }

        .tabLeftBorder {
          border-right: 1px solid #6a7286 !important;
        }
      `}</style>
    </Wrapper>
  );
};

export default FilterUserByCategories;

