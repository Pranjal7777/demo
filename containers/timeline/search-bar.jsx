import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";

import * as config from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { open_drawer } from "../../lib/global";
import Icon from "../../components/image/icon";
const FigureImage = dynamic(() => import("../../components/image/figure-image"), { ssr: false });
const InputBox = dynamic(() => import("../../components/input-box/input-box"), { ssr: false });

export default function ModelSearchBar(props) {
  const { agency } = props;
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const theme = useTheme();

  return (
    <>
      <div
        className={mobileView ? `col-12 ${props.className}` : "col-12 p-0"}
      >
        <div
          className={mobileView
            ? `adjustMargin position-relative${props.bulkSearch ? "" : " form-group"}`
            : "form-group position-relative m-0"
          }
        >
          <div
            className={`position-relative ${props.search_cont}`}
            // onClick={() => {
            //   !props.handleSearch && open_drawer("search", { theme }, "right");
            // }}
            onClick={props.onlySearch
              ? () => { }
              : () => open_drawer("HashtagSearchDrawer", {}, "right")}
          >
            <InputBox
              onChange={props.handleSearch}
              value={props.value}
              // className={
              //   mobileView
              //     ? "form-control mv_search_input"
              //     : "form-control dv__search_input"
              // }
              fclassname={`form-control sidebar_bg ${props.fclassname}`}
              cssStyles={
                mobileView
                  ? props?.webSearchFollowObj ? props?.webSearchFollowObj : theme.search_input
                  : theme.type === "dark"
                    ? theme.search_input
                    : props?.webSearchFollowObj ? props?.webSearchFollowObj : theme?.search_input
              }
              style={{ padding: '0px 0px 0px 47px' }}
              placeholder={props.placeholder || "Search"}
              autoComplete="off"
              inputRef={props?.ref}
              focus={props?.focus}
            />
            <Icon
              icon={`${config.SEARCHBAR_ICON}#searchBar`}
              color={theme.type == "light" || agency ? "#4e586e" : theme.text}
              styles={mobileView ? theme.searchIcon : ""}
              width={mobileView ? 18 : 13}
              height={22}
              class={mobileView ? "mobileSearchIcon" : "dv__search_icon search"}
              viewBox="0 0 511.999 511.999"
            />
            {props.crossIcon && (
              <p className="search-cross-icon cursorPtr" onClick={props.onClick}>
                {lang.btnX}
              </p>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .form-control::-webkit-input-placeholder {
          color: #000 !important;
        }
        
      `}
      </style>
    </>
  );
}
