import React, { useState } from 'react';
import { useTheme } from 'react-jss';
import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import isMobile from '../../../../hooks/isMobile';
import Wrapper from '../../../../hoc/Wrapper';
import Header from '../../../header/header';
import ActiveSection from '../dataOverride/activeSection';
import useLang from '../../../../hooks/language';
import * as config from '../../../../lib/config';
import { close_drawer, open_drawer } from '../../../../lib/global';
import ExpiredSection from './expiredSection';

const useStyles = makeStyles({
  tabs: {

    '& .MuiTabs-indicator': {
      backgroundColor: 'var(--l_base)',
      height: 3,
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#151515',
    },
  },
});

const dataOverride = (props) => {
  const { onClose } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();

  const [value, setValue] = useState(0);

  const handleCloseDrawer = () => {
    onClose();
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

  const handleDialog = (type, propsToAdd = {}) => {
    const propsToUseAddOverride = {
      heading: lang.SetYourHours,
      ...propsToAdd
    };
    switch (type) {
      case 'setAddOverride':
        close_drawer();
        setTimeout(() => {
          open_drawer('setAddOverride', { ...propsToUseAddOverride, fromEdit: true }, 'right');
        }, 100);
        break;
      default:
        console.log('error');
    }
  };

  return (
    <div className="mv_wrap_videoCall bg_color" id="home-page">
      {mobileView ? (
        <Wrapper>
          <Header title={`${lang.DateOverride}`} icon={config.backArrow} back={handleCloseDrawer} />
          <div style={{ paddingTop: '60px' }} className="videoCall__setting_section h-100">
            <Wrapper>
              <Tabs
                className={classes.tabs}
                value={value}
                variant="fullWidth"
                onChange={handleTab}
                style={{
                  background: `${mobileView ? theme.background : ''}`,
                }}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab
                  className="text-capitalize font-weight-bold fntSz16 text-app"
                  label={lang.Active}
                />
                <Tab
                  className="text-capitalize font-weight-bold fntSz16 text-app"
                  label={lang.Expired}
                />
              </Tabs>
            </Wrapper>
            <TabPanel value={value} index={0}>
              <ActiveSection
                handleDialog={handleDialog}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ExpiredSection
                handleDialog={handleDialog}
              />
            </TabPanel>
          </div>
        </Wrapper>
      ) : (
        <Wrapper>
          desktop View
        </Wrapper>
      )}
      <style jsx>
        {`
        .confirmBtn{
          position: fixed;
          width: 100%;
          bottom: 0;
        }
        `}
      </style>
    </div>
  );
};

export default dataOverride;
