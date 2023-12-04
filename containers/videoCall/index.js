import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "react-jss";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import isMobile from "../../hooks/isMobile";
import Wrapper from "../../hoc/Wrapper";
import Header from "../../components/header/header";
import useLang from "../../hooks/language";
import * as config from "../../lib/config";
import PriceSection from "./priceSection";
import ScheduleSection from "./scheduleSection";

const useStyles = makeStyles({
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "var(--l_base)",
      height: 3,
    },
    "& .MuiTab-root.Mui-selected": {
      color: "#151515",
    },
  },
});

const index = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [lang] = useLang();
  const router = useRouter();
  const [mobileView] = isMobile();

  const [value, setValue] = useState(0);

  const handleCloseDrawer = () => {
    router.back();
  };

  const handleTab = (e, newValue) => {
    setValue(newValue);
  };

  // const tabChange = (newValue) => {
  //   setValue(newValue);
  // };

  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && <div>{children}</div>}</>;
  };
  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  return (
    <div className="mv_wrap_videoCall videoCall__setting_section" id="home-page">
      <Wrapper>
        <div style={{ marginTop: "30px" }}>
          <PriceSection />
        </div>
      </Wrapper>
      <style jsx>
        {`
          .confirmBtn {
            position: fixed;
            width: 100%;
            bottom: 0;
          }
          .dynamicHeight {
            height: calc(var(--vhCustom, 1vh) * 100) !important;
          }
        `}
      </style>
    </div>
  );
};

export default index;
