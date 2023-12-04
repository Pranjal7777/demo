import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";

import {
  GREY_VARIANT_2,
  DARK_GREY,
  GREY_VARIANT_4,
  PLUS,
  MINUS,
  COLOR_FILTER,
  CUSTOMER_RATINGS_FILTER,
  DISCOUNT_FILTER,
  PRICE_FILTER,
} from "../../lib/config";
import Wrapper from "../../hoc/Wrapper";
import Image from "../../components/image/image";
import CustomCheckbox from "../checkbox/checkbox";

import RangeSelector from "../../containers/filters/range-selector/range-selector";

const ExpansionPanel = withStyles({
  root: {
    // border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    padding: 0,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "transparent",
    // borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 20,
    padding: 0,
    "&$expanded": {
      minHeight: 20,
    },
  },
  content: {
    "&$expanded": {
      margin: "6px 0",
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: "10px 20px",
    background: "transparent",
    margin: "1px 0px",
    flexDirection: "column",
  },
}))(MuiExpansionPanelDetails);

export default function CustomizedCollapse(props) {
  const [expanded, setExpanded] = React.useState("Brands");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const {
    rendered,
    filterName,
    filterData,
    handleFilterSelection,
    handleFilterSearch,
    showItems,
    handleSeeAllFilters,
    handlePriceFilter,
    currencySymbol,
    isPriceFilterRendered,
    handlePriceFilterUI,
  } = props;

  return (
    <Wrapper>
      {rendered ? (
        <div>
          <ExpansionPanel
            square
            expanded={expanded == filterName}
            onChange={handleChange(filterName)}
          >
            <ExpansionPanelSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              {/* Filter Name Section */}
              <Typography className="collapseHeading">
                {filterName}
                {/* <span className="collapseIndicator">-</span> */}
                {expanded == filterName ? (
                  <Image
                    alt="minus"
                    src={MINUS}
                    height="12px"
                    className="collapseIndicator"
                  />
                ) : (
                  <Image
                    alt="plus"
                    src={PLUS}
                    height="12px"
                    className="collapseIndicator"
                  />
                )}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: "column" }}>
              {/* <input
                type="text"
                className="searchBoxFiter"
                placeholder={`Search By ${filterName}...`}
                name={filterName}
                onChange={handleFilterSearch}
              /> */}
              {rendered ? (
                <Typography className="collapseBodyText">
                  {/* Generate Filter Selections Based on the Data */}
                  {filterData &&
                    filterData.map((filterValue, filterValIndex) =>
                      showItems && filterValIndex < showItems ? (
                        filterName == COLOR_FILTER ? (
                          <div className="d-flex align-items-center">
                            <span
                              className="onScreenColor"
                              style={{
                                background: filterValue.rgb,
                              }}
                            />
                            <CustomCheckbox
                              label={filterValue.name}
                              key={"filter-desk-" + filterValIndex}
                              onCBChange={handleFilterSelection}
                              parent={filterName}
                              penCount={filterValue.penCount}
                            />
                          </div>
                        ) : filterName == CUSTOMER_RATINGS_FILTER ? (
                          <CustomCheckbox
                            label={filterValue.name}
                            key={"filter-desk-" + filterValIndex}
                            onCBChange={handleFilterSelection}
                            parent={filterName}
                            penCount={filterValue.penCount}
                          />
                        ) : filterName == DISCOUNT_FILTER ? (
                          <CustomCheckbox
                            label={filterValue.name}
                            key={"filter-desk-" + filterValIndex}
                            onCBChange={handleFilterSelection}
                            parent={filterName}
                            customValue={filterValue.value}
                            penCount={filterValue.penCount}
                          />
                        ) : (
                          <CustomCheckbox
                            label={filterValue.name}
                            key={"filter-desk-" + filterValIndex}
                            onCBChange={handleFilterSelection}
                            parent={filterName}
                            penCount={filterValue.penCount}
                          />
                        )
                      ) : !showItems ? (
                        filterName == COLOR_FILTER ? (
                          <div className="d-flex align-items-center">
                            <span
                              className="onScreenColor"
                              style={{
                                background: filterValue.rgb,
                              }}
                            />
                            <CustomCheckbox
                              label={filterValue.name}
                              key={"filter-desk-" + filterValIndex}
                              onCBChange={handleFilterSelection}
                              parent={filterName}
                              penCount={filterValue.penCount}
                            />
                          </div>
                        ) : filterName == CUSTOMER_RATINGS_FILTER ? (
                          <CustomCheckbox
                            label={filterValue.name}
                            key={"filter-desk-" + filterValIndex}
                            onCBChange={handleFilterSelection}
                            parent={filterName}
                            customValue={filterValue.value}
                            penCount={filterValue.penCount}
                          />
                        ) : filterName == DISCOUNT_FILTER ? (
                          <CustomCheckbox
                            label={filterValue.name}
                            key={"filter-desk-" + filterValIndex}
                            onCBChange={handleFilterSelection}
                            parent={filterName}
                            customValue={filterValue.value}
                            penCount={filterValue.penCount}
                          />
                        ) : filterName != PRICE_FILTER ? (
                          <CustomCheckbox
                            label={filterValue.name}
                            key={"filter-desk-" + filterValIndex}
                            onCBChange={handleFilterSelection}
                            parent={filterName}
                            penCount={filterValue.penCount}
                          />
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )
                    )}
                </Typography>
              ) : (
                ""
              )}

              {showItems < filterData.length ? (
                <a
                  className="seeAllLink"
                  name={filterName}
                  onClick={handleSeeAllFilters}
                >
                  See all
                </a>
              ) : showItems && showItems >= filterData.length ? (
                <a
                  className="seeAllLink"
                  name={false}
                  onClick={() => handleSeeAllFilters(null)}
                >
                  See Less
                </a>
              ) : (
                ""
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      ) : (
        ""
      )}

      <style>
        {`
            .collapseHeading{
              font-weight: 500;
              font-family: inherit;
              font-size: 13px;
              width: 100%;
              display: flex;
              align-items: center;
            }

            .collapseBodyText{
              font-size: 12px;
              font-weight: 500;
            }

            .collapseIndicator{
              // float: right;
              // width: 20px;
              position: absolute;
              right: 0;
            }

            .searchBoxFiter{
              border: 0.5px solid ${DARK_GREY};
              font-size: 12px;
              margin-bottom: 10px;
              padding: 5px;
            }
            
            .seeAllLink{
              font-size: 12px;
              text-decoration: underline !important;
              margin-top: 8px;
            }

            .onScreenColor {
              height: 20px;
              width: 22px;
              border-radius: 50%;
              margin-right: 10px;
              border: 2px solid ${GREY_VARIANT_4}
            }
                  
        `}
      </style>
    </Wrapper>
  );
}
