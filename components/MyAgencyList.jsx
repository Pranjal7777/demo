import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '../containers/timeline/search-bar'
import dynamic from 'next/dynamic';

import useAgencyList from '../hooks/useAgencyList';
import ModelSearchBar from '../containers/timeline/search-bar';
import { useSelector } from 'react-redux';
import { backNavMenu } from '../lib/global/loader';
import Header from './header/header';
import { backArrow } from '../lib/config/profile';
import PaginationIndicator from './pagination/paginationIndicator';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import CustomDataLoader from './loader/custom-data-loading';
import { AGENCY_PLACEHOLDER } from '../lib/config/placeholder';
import Image from './image/image';

const Paper = dynamic(() => import("@material-ui/core/Paper"));
const Tab = dynamic(() => import("@material-ui/core/Tab"));
const Tabs = dynamic(() => import("@material-ui/core/Tabs"));
const AgencyTile = dynamic(() => import("./AgencyTile"));

const MyAgencyList = (props) => {
  const { value,
    searchValue,
    isLoading,
    setSearchValue,
    handleTab,
    getAgency, getMyAgency, handlePageEvent } = useAgencyList()
  const findAgency = useSelector((state) => state.allAgency)
  const myAgency = useSelector((state) => state.myAgencyData)

  useEffect(() => {
    getAgency(0)
    getMyAgency(0)
  }, [myAgency?.currentAgencyData?.length])
  const getUserSugge = useCallback(
    debounce((value) => {
      getAgency(0, value)
    }, 400),
    [getAgency]
  );
  const handleInputChange = (event) => {
    setSearchValue(event.target.value)
    getUserSugge(event.target.value)
  };
  const removeSearch = () => {
    setSearchValue();
    getAgency(0);
  }
  const TabsFunction = () => {
    return (
      <div className='col-12 py-3'>
        <Tabs
          value={value}
          onChange={handleTab}
          indicatorColor="primary"
          textColor="primary"
          TabIndicatorProps={{ style: { background: "none", height: "2px", color: "#fff" } }}
        >
          {!(myAgency?.currentAgencyData?.length) && <Tab
            className="text-capitalize text-left fntSz16 tabstyleMob"
            label="Find Agency"
          />}
          {(myAgency?.currentAgencyData?.length) && <Tab
            className="text-capitalize fntSz16 tabstyleMob ml-3"
            label="My Agency"
          />}
        </Tabs>
      </div>
    );
  };
  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && <div>{children}</div>}</>;
  };
  const FindAgency = () => {
    return (
      <div>
        <div id="findAgency" className='col-12 p-0' style={{ height: "80vh", overflowY: "auto", overflowX: "hidden" }}>
        <ModelSearchBar
          value={searchValue}
          handleSearch={handleInputChange}
          agency
          fclassname="searchbar"
          onlySearch
          focus
          crossIcon
          onClick={removeSearch}
        />
        {findAgency?.length ? findAgency?.map((data, index) => {
          return (
            <AgencyTile data={data} key={index}
              myAgency={myAgency}
            />)
        }) : <div>
              {isLoading ? <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={isLoading} size={60} />
              </div> :
                <div className='d-flex align-items-center justify-content-center'>
                  <Image
                    width="200"
                    src={AGENCY_PLACEHOLDER}
                  />
                  <h4 className='d-flex align-items-center justify-content-center'>No Data Found</h4>
                </div>}
          </div>}
        </div>
        <PaginationIndicator
          id="findAgency"
          totalData={findAgency}
          // pageEventHandler={handlePageEvent}
        />
      </div>
    )
  }
  const MyAgency = () => {
    return (
      <div className='col-12 d-flex flex-column pb-2 px-0' style={{ height: "70vh", overflowY: "scroll", overflowX: "hidden" }}>
        {myAgency?.currentAgencyData?.[0]?.status == "ACCEPTED" ? <div>
          <h6 className='pt-4 ml-2'>Current Agency</h6>
          {myAgency?.currentAgencyData?.length ? myAgency?.currentAgencyData?.map((data, index) => {
            return (
              <AgencyTile data={data} key={index}
                isCurrent
              />
            )
          }) :

            <div className='d-flex align-items-center justify-content-center' style={{ height: "10vh" }}>
              <h4>No Data Found</h4>
            </div>}
        </div>
          :
          <div>
            <h6 className='text-app pt-4 ml-2'>Requested Agency</h6>
            {myAgency?.currentAgencyData?.length ? myAgency?.currentAgencyData?.map((data, index) => {
              return (
                <AgencyTile data={data} key={index}
                  isRequested
                />
              )
            }) :

              <div className='d-flex align-items-center justify-content-center' style={{ height: "10vh" }}>
                <h4>No Data Found</h4>
              </div>}
          </div>}
        <div>
          <h6 className='text-app pt-4 ml-2'>Past Agency</h6>
          {myAgency?.pastAgencyData?.length ? myAgency?.pastAgencyData?.map((data, index) => {
            return (
              <AgencyTile data={data} key={index}
                isPast
              />)
          }) : <div className='d-flex align-items-center justify-content-center' style={{ height: "10vh" }}>
            <h4>No Data Found</h4>
          </div>}
        </div>
        {isLoading && <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
          <CustomDataLoader type="ClipLoader" loading={isLoading} size={60} />
        </div>}
      </div>
    )
  }

  const TabsPanelFunction = () => {
    return (
      <>
        <TabPanel value={value} index={0}>
          {(myAgency?.currentAgencyData?.length) ? <MyAgency /> : <FindAgency />
          }
        </TabPanel>
      </>
    );
  };
  return (
    <div className='col-12 h-100 p-0'>
      <div className='col-12 pt-4 pl-5'>
        <h6 className='pb-1'>My Agency</h6>
        <Header
          title="My Agency"
          Data='My Agency'
          icon={backArrow}
        />
      </div>
      <div>
        <div className='border_Bottom' style={{ paddingTop: "6vh" }}>
          {/* {TabsFunction()} */}
        </div>
        <div className='col-12 pr-0'>
          {TabsPanelFunction()}
        </div>
      </div>
      <style jsx>{`
      :global(.searchbar){
        border:1px solid var(--l_light_grey) !important;
        color:#fff !important;
        background:transparent !important;
        border-radius:12px !important;
        caret-color:#fff !important;
      }
      :global(.searchbar::placeholder){
        font-size:13px !important;
        color: var(--l_light_grey) !important;
      }
      :global( .MuiTab-root.tabstyleMob){
        padding:4px 16px !important;
        min-height:35px !important;
        border:1px solid #836B8A;
        border-radius:28px;
        color:#836B8A !important;
      }
      :global( .Mui-selected.tabstyleMob) {
  background: linear-gradient(to right,#FF71A4, #D33BFE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border:1px solid #FF71A4;
  border-radius:28px;
      }
      
      `}</style>
    </div>
  )
}

export default MyAgencyList