import React, { useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";

const AvailableCategories = () => {
  const [mobileView] = isMobile();
  const theme = useTheme();

  const [categoryOptions, setCategoryOptions] = useState([
    "Home",
    "Featured",
    "Actors",
    "Reality TV",
    "Athleres",
    "Athleres",
    "Comedians",
    "Creators",
    "All categories",
  ]);
  return (
    <Wrapper>
      <div className="web_main_div">
        <div className={`col-12 d-flex ${!mobileView && "px-0"} catCss`}>
          {categoryOptions.map((category, index) => (
            <div className="col-auto px-1">
              <div className="px-3 cursorPtr py-2 cateLabel" key={index}>
                {category} <span className="fntSz10 catCount">256</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .web_main_div {
          padding-top: ${mobileView ? "10px" : "100px"};
          padding-bottom: 20px;
        }
        .cateLabel {
          background: ${theme.background};
          border-radius: 22px;
        }
        .catCount {
          color: #c0c0c0;
        }

        .catCss {
          width: 98vw;
          overflow-x: auto;
        }

        :global(.catCss::-webkit-scrollbar) {
          height: 0 !important !important;
          display: none !important;
        }
      `}</style>
    </Wrapper>
  );
};

export default AvailableCategories;
