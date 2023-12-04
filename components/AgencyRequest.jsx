import React, { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic';

import useAgencyList from '../hooks/useAgencyList';
import ModelSearchBar from '../containers/timeline/search-bar';
import { useSelector } from 'react-redux';
import { AGENCY_PLACEHOLDER } from '../lib/config/placeholder';
import Image from './image/image';
import PaginationIndicator from './pagination/paginationIndicator';
import { debounce } from 'lodash';
import useLang from '../hooks/language';

const Tab = dynamic(() => import("@material-ui/core/Tab"));
const Tabs = dynamic(() => import("@material-ui/core/Tabs"));
const AgencyTile = dynamic(() => import("./AgencyTile"));
import CustomDataLoader from './loader/custom-data-loading';

const AgencyRequest = () => {
  const [lang] = useLang();
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
  const TabsFunction = () => {
    return (
      <div className='col-12 pb-1 pl-3'>
        <Tabs
          value={value}
          onChange={handleTab}
          indicatorColor="primary"
          textColor="primary"
          TabIndicatorProps={{ style: { background: "var(--l_base)", height: "2px", color: "#fff" } }}
        >
          {!(myAgency?.currentAgencyData?.length) && <Tab
            className="text-capitalize font-weight-bold text-left text-app fntSz16 tabstyle"
            label="Find Agency"
          />}
          {(myAgency?.currentAgencyData?.length) && <Tab
            className="text-capitalize font-weight-bold text-app fntSz16 tabstyle"
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
        <div id="findAgency" className='col-12 py-4' style={{ height: "70vh", overflowY: "auto", overflowX: "hidden" }}>
        <ModelSearchBar
          value={searchValue}
          handleSearch={handleInputChange}
          agency
          fclassname="searchbar"
          onlySearch
          focus
        />
        {findAgency?.length ? findAgency?.map((data, index) => {
          return (
            <AgencyTile data={data} key={index}
              myAgency={myAgency}
            />)
        }) : <div >
              {isLoading ? <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={isLoading} size={60} />
              </div> : <div className='d-flex align-items-center justify-content-center'>
            <Image
              width="300"
              src={AGENCY_PLACEHOLDER}
              style={{ paddingTop: "6rem" }}
                  />
          <h4 className='d-flex align-items-center justify-content-center'>No Agency Found</h4>
        </div>}
          </div>}
        </div>
        <PaginationIndicator
          id="findAgency"
          totalData={findAgency}
          pageEventHandler={handlePageEvent}
        />
      </div>
    )
  }
  const MyAgency = () => {
    return (
      <div className='col-12 d-flex flex-column pb-2' style={{ height: "70vh", overflowY: "scroll", overflowX: "hidden" }}>
        {myAgency?.currentAgencyData[0]?.status == "ACCEPTED" ? <div>
          <h6 className='pt-4 ml-2'>Current Agency</h6>
          {myAgency?.currentAgencyData.length ? myAgency?.currentAgencyData?.map((data, index) => {
            return (
              <AgencyTile data={data} key={index}
                isCurrent
              />
            )
          }) :

            <div className='d-flex align-items-center justify-content-center' style={{ height: "10vh" }}>
              <h4>No Data Found</h4>
            </div>}
          {isLoading && <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
            <CustomDataLoader type="ClipLoader" loading={isLoading} size={60} />
          </div>}
        </div>
          :
        <div>
            {!!myAgency?.currentAgencyData.length && <h6 className='text-app pt-4 ml-2'>Requested Agency</h6>}
          {myAgency?.currentAgencyData.length ? myAgency?.currentAgencyData?.map((data, index) => {
            return (
              <AgencyTile data={data} key={index}
                isRequested
              />
            )
          }) :

              ""}
          </div>}
        <div>
          <h6 className='text-app pt-4 ml-2'>Past Agency</h6>
          {myAgency?.pastAgencyData.length ? myAgency?.pastAgencyData?.map((data, index) => {
            return (
              <AgencyTile data={data} key={index}
                isPast
              />)
          }) : <div className='d-flex align-items-center justify-content-center' style={{ height: "10vh" }}>
            <h4>No Data Found</h4>
          </div>}
        </div>
        <style jsx>{`
        .borderAll{
          border:1px solid #DBDBDB;
          border-radius:12px;
        }
        `}</style>
      </div>
    )
  }

  const TabsPanelFunction = () => {
    return (
      <>
          {(myAgency?.currentAgencyData?.length) ? <MyAgency /> : <FindAgency />
        }
      </>
    );
  };
  return (
    <div className='col-12 h-100 pl-0'>
      <div className='col-12 pt-4 pl-3'>
        <h3 className='pb-1 sectionHeading'>Agency</h3>
      </div>
      <div>
        <div className='border_Bottom'>
          {TabsFunction()}
        </div>
        <div className='col-12 pl-0 pr-0'>
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
      .border_Bottom{
        border-bottom:1px solid #DBDBDB;
      }
      :global(.MuiTab-root.tabstyle){
        min-width:0 !important;
        padding:6px 20px !important;
      }
      `}</style>
    </div>
  )
}

export default AgencyRequest