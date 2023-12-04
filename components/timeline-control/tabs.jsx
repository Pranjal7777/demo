import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
const AppBar = dynamic(()=>import("@material-ui/core/AppBar"),{ssr:false});
const Tabs = dynamic(()=>import("@material-ui/core/Tabs"),{ssr:false});
const Tab = dynamic(()=>import("@material-ui/core/Tab"),{ssr:false});
const Typography = dynamic(()=>import("@material-ui/core/Typography"),{ssr:false});
const Box = dynamic(()=>import("@material-ui/core/Box"),{ssr:false});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  //   PrivateTabIndicator-colorSecondary-5: {
  //     display: "none",
  //   },
}));

export default function SimpleTabs() {
  // console.log("sipkle-tabs");
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          className="roo"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}
