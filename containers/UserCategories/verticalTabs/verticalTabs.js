import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "react-jss";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CheckboxLabels from "../filterGroup/checkRadioGroup";
import PriceFilterComponent from "../filterGroup/priceFilterComponent";
import InputRanges from "../../../components/input-range-picker-comp/input-range-picker";
import useLang from "../../../hooks/language";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = props => makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: props.theme.background,
    display: "flex",
    height: 500,
    selected: {
      background: "red",
    },
  },
  tabs: {
    borderRight: `1px solid #34353E`,
    width: "70%",
    textTransform: "none",
    indicator: {
      background: props.theme.palette.divider,
    },

    "& .Mui-selected": {
      backgroundColor: "var(--l_base)",
      height: 3,
    },
    "& .MuiTab-wrapper": {
      textTransform: "capitalize",
      fontSize: "16px",
      alignItems: "start",
      color: props.theme.text,
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent",
      height: 3,
    },
  },
  TabPanel: {
    width: "100%",
    "& .MuiBox-root": {
      padding: "0px 10px",
    },
  },
}));

export default function VerticalTabs(props) {
  const { sortByRatings, sortByPrice, checkboxList, shoutoutRating, isFromCategorySection } = props;
  const theme = useTheme();
  const classes = useStyles({ theme: theme })();
  const [value, setValue] = React.useState(0);
  const [lang] = useLang();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [sortByRatingsInnerState, setSortByRatingsInnerState] = useState([...sortByRatings]);
  const [sortByPriceInnerState, setSortByPriceInnerState] = useState([...sortByPrice]);
  const [sortByCategoryInnerState, setSortByCategoryInnerState] = useState([...checkboxList]);
  const [sortByShoutoutInnerState, setSortByShoutoutInnerState] = useState([...shoutoutRating]);
  const [minValue, setMinValue] = useState(null)
  const [maxValue, setMaxValue] = useState(null)
  const handleState = (filterType, id) => {
    switch (filterType) {
      case lang.avgRating:
        let data = [];
        sortByRatingsInnerState.map((ratingFilter, index) => {
          if (id == index) {
            let selectedLabel = { ...ratingFilter, checked: !ratingFilter.checked }
            data.push(selectedLabel);
          } else {
            let unselectedLabel = { ...ratingFilter, checked: false }
            data.push(unselectedLabel);
          }
        })
        setSortByRatingsInnerState([...data])
        props?.handleCheckboxValue(filterType, id, data)
        break;

      case lang.filterByPrice:
        let priceData = [];
        sortByPriceInnerState.map((priceFilter, index) => {
          if (id == index) {
            let selectedLabel = { ...priceFilter, checked: !priceFilter.checked }
            setMinValue(selectedLabel?.from)
            setMaxValue(selectedLabel?.to)
            priceData.push(selectedLabel);
          } else {
            let unselectedLabel = { ...priceFilter, checked: false }
            priceData.push(unselectedLabel);
          }
          setSortByPriceInnerState([...priceData])
        })
        props?.handleCheckboxValue(filterType, id, priceData)
        break;

      case lang.filterCategory:
        if (sortByCategoryInnerState.length > 0) {
          let categoryFilter = [...sortByCategoryInnerState];
          categoryFilter[id] = {
            ...categoryFilter[id], checked: !sortByCategoryInnerState[id].checked
          }
          setSortByCategoryInnerState([...categoryFilter]);
          props?.handleCheckboxValue(filterType, id, categoryFilter)
        }
        break;

      case lang.shoutoutCount:
        let shoutoutFilterCount = [];
        sortByShoutoutInnerState.map((priceFilter, index) => {
          if (id == index) {
            let selectedLabel = { ...priceFilter, checked: !priceFilter.checked }
            shoutoutFilterCount.push(selectedLabel);
          } else {
            let unselectedLabel = { ...priceFilter, checked: false }
            shoutoutFilterCount.push(unselectedLabel);
          }
          setSortByShoutoutInnerState([...shoutoutFilterCount])
        })
        props?.handleCheckboxValue(filterType, id, shoutoutFilterCount)
        break;
    }
  }

  const handleInnerRange = (value) => {
    let unCheckedPriceFilter = [];
    sortByPriceInnerState.map((priceFilter, index) => {
      let unselectedLabel = { ...priceFilter, checked: false }
      unCheckedPriceFilter.push(unselectedLabel);
      setSortByPriceInnerState([...unCheckedPriceFilter])
    })
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {!isFromCategorySection && <Tab label={lang.categories} {...a11yProps(0)} />}
        <Tab label={lang.price} {...a11yProps(isFromCategorySection ? 0 : 1)} />
        <Tab label={lang.rating} {...a11yProps(isFromCategorySection ? 1 : 2)} />
        <Tab label={lang.shoutoutCount} {...a11yProps(isFromCategorySection ? 2 : 3)} />
      </Tabs>
      {!isFromCategorySection && <TabPanel className={classes.TabPanel} value={value} index={0}>
        <div>
          <CheckboxLabels
            category_label={props?.category_label}
            checkboxList={sortByCategoryInnerState}
            labelPlacement="start"
            setFilterValue={props?.setFilterValue}
            handleState={handleState}
            filterType={lang.filterCategory}
            handleCheckboxValue={props?.handleCheckboxValue}
          />
        </div>
      </TabPanel>}
      <TabPanel className={classes.TabPanel} value={value} index={isFromCategorySection ? 0 : 1}>
        <div>
          <InputRanges
            checkboxList={sortByPriceInnerState}
            labelPlacement="end"
            filterType={lang.filterByPrice}
            handleCheckboxValue={props?.handleCheckboxValue}
            handleState={handleState}
            maxValue={maxValue || props.maxValue}
            minValue={minValue || props.minValue}
            minShoutoutValue={minValue || props.minShoutoutValue}
            handleRange={props?.handleRange}
            handleInnerRange={handleInnerRange}
          />
        </div>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={isFromCategorySection ? 1 : 2}>
        <div>
          <CheckboxLabels
            checkboxList={sortByRatingsInnerState}
            handleState={handleState}
            labelPlacement="end"
            setFilterValue={props?.setFilterValue}
            filterType={lang.avgRating}
            handleCheckboxValue={props?.handleCheckboxValue}
          />
        </div>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={isFromCategorySection ? 2 : 3}>
        <div>
          <CheckboxLabels
            checkboxList={sortByShoutoutInnerState}
            handleState={handleState}
            labelPlacement="end"
            setFilterValue={props?.setFilterValue}
            filterType={lang.shoutoutCount}
            handleCheckboxValue={props?.handleCheckboxValue}
          />
        </div>
      </TabPanel>
    </div>
  );
}
