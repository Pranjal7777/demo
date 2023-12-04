import React, { useState } from "react";
import InputBox from "../../components/input-box/input-box";
import FigureImage from "../../components/image/figure-image";
import * as config from "../../lib/config";
// import useTheme from "../../hooks/useTheme";
import { useTheme } from "react-jss";

const ExploreSearch = () => {
  const [search, setSearch] = useState("");
  const theme = useTheme();

  return (
    <div>
      {" "}
      <form className="col-12">
        <div className="form-group">
          <div className="position-relative">
            <InputBox
              disabled
              onChange={(e) => {
                let value = e.target.value;
                setSearch(value);
              }}
              value={search}
              fclassname="form-control"
              cssStyles={theme.search_input}
              style={theme.search_input}
              placeholder="Search"
              autoComplete="off"
            />
            <FigureImage
              cssStyles={theme.searchIcon}
              src={config.SEACH_WHITE}
              width={18}
              alt="search_inactive_icon"
            />
          </div>
          <div className="searcg-container"></div>
        </div>
      </form>
    </div>
  );
};

export default ExploreSearch;
