import dynamic from 'next/dynamic';
import React, { useEffect } from 'react'
import { useTheme } from 'react-jss';
import { ADMININFO, ADMINLOG, APPROVE, LINKAGENCY, REJECTED } from '../../lib/config/logo';
import Icon from '../../components/image/icon';
import { open_dialog } from '../../lib/global/loader';
import Router, { useRouter } from 'next/router';
import useAgencyCreatorList from './hook/useAgencyCreatorList';
import Image from '../../components/image/image';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../lib/date-operation/date-operation';
import { NO_DATA_PLACEHOLDER } from '../../lib/config/placeholder';
import ShowMore from '../../components/show-more-text/ShowMoreText';
import { Tooltip } from '@material-ui/core';
import useLang from '../../hooks/language';
import { MAIN_DOMAIN } from '../../lib/config/creds';
import PaginationIndicator from '../../components/pagination/paginationIndicator';
import { getAgencyCreatorList } from '../../redux/actions/agency';
import { handleContextMenu } from '../../lib/helper';
const Paper = dynamic(() => import("@material-ui/core/Paper"));
const Tab = dynamic(() => import("@material-ui/core/Tab"));
const Tabs = dynamic(() => import("@material-ui/core/Tabs"));


const CreatorAgency = () => {
  const theme = useTheme();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const { value,
    employeeData,
    totalPostCount,
    setValue,
    handleTab,
    getCreatorList, handlePageEvent } = useAgencyCreatorList();
  const apiData = useSelector((state) => state.creatorAgencyData)
  const [lang] = useLang();
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAgencyCreatorList([]))
    getCreatorList(0, 0)
  }, [])
  const TabsFunction = () => {
    return (
      <Tabs
        value={value}
        // variant="fullWidth"
        onChange={handleTab}
        // indicatorColor="#C726F2"
        // textColor="#C726F2"
        TabIndicatorProps={{ style: { background: theme.appColor, height: "3px" } }}
      >
        <Tab
          className="text-capitalize font-weight-bold fntSz18"
          label={lang.newRequest}
        />
        <Tab
          className="text-capitalize font-weight-bold fntSz18"
          label={lang.pendingAdmin}
        />
        <Tab
          className="text-capitalize font-weight-bold fntSz18"
          label={lang.linkedAccepted}
        />
        <Tab
          className="text-capitalize font-weight-bold fntSz18"
          label={lang.unlinkedRejected}
        />
        <Tab
          className="text-capitalize font-weight-bold fntSz18"
          label={lang.cancelled}
        />
      </Tabs>
    );
  };
  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && <div style={{ height: '89%' }}>{children}</div>}</>;
  };
  const NewRequest = () => {
    return (
      <div>
        <div className='w-100' id="requestTab" style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.requestedOn}</th>
            <th>{lang.creatorName}</th>
            <th>{lang.creatoruName}</th>
            <th>{lang.commission}</th>
            <th>{lang.description}</th>
            <th>{lang.actions}</th>
          </tr>
          {apiData?.length ?
            apiData?.map((data) => {
              return (
                <tr className='text-app pt-2 text-left py-3 tabBorder' key={data._id}>
                  <td className='p-3'>
                    <Image
                      src={s3ImageLinkGen(S3_IMG_LINK, data.creatorDetails.profilePic, 100, 200, 200)}
                      style={{
                        borderRadius: "50%",
                        maxWidth: "42px",
                        maxHeight: "42px",
                      }}
                    />
            </td>
                  <td>{formatDate(data.requestedAt, "MMM D,  YYYY h:mm a")}</td>
                  <td>{data.creatorDetails.firstName} {data.creatorDetails.lastName}</td>
                  <td className='hoverName' onClick={() => router.push(`https://testbombshellsite.com/${data.creatorDetails.username}`)}>@{data.creatorDetails.username}</td>
                  <td>{data.commissionPercentage}%</td>
                  <td className='width16 text-break'>{data.description ? <ShowMore count={50} text={data.description} /> : lang.na} </td>
            <td>
              <div className='d-flex flex-row justify-content-start'>
                      <Tooltip title={lang.accept} placement="top">
                        <div>
                          <Icon
                  icon={`${APPROVE}#Approve`}
                  width={35}
                  height={35}
                            class="cursorPtr "
                  onClick={() => {
                    open_dialog("selectAgency", {
                      details: data.creatorDetails,
                      creatorId: data.creatorId
                    })
                  }}
                />
                        </div>
                      </Tooltip>
                      <Tooltip title={lang.reject} placement="top">
                        <div>
                <Icon
                  icon={`${REJECTED}#Rejected`}
                  width={35}
                  height={35}
                        class="pl-2 cursorPtr"
                  onClick={() => {
                    open_dialog("reasonAgency", {
                      text: "Reject Creator",
                      btnText: "Submit",
                      id: data.creatorId,
                      status: "REJECTED",
                      isCreator: true
                    })
                  }}
                />
                        </div>
                      </Tooltip>
                    </div>
            </td>
          </tr>
              )
            })
            : ""}
        </table>
          {!apiData?.length && <div className='d-flex align-items-center justify-content-center flex-column' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
          <p className='text-app text-center bold fntSz24'>No New Requests Found!</p>
        </div>
        }
        <style jsx>{`
       td:first-child,
       th:first-child {
         border-radius: 10px 0 0 10px;
       }
       td:last-child,
       th:last-child {
         border-radius: 0 10px 10px 0;
       }
        `}</style>
      </div>
        <PaginationIndicator
          id="requestTab"
          totalData={apiData}
          totalCount={totalPostCount}
          pageEventHandler={() => handlePageEvent(0)}
        />
      </div>
    )
  }
  const PendingAdmin = () => {
    return (
      <div>
        <div id="pendingTab" className='w-100' style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.requestedOn}</th>
            <th>{lang.creatorName}</th>
            <th>{lang.creatoruName}</th>
            <th>{lang.commission}</th>
            <th>{lang.description}</th>
            <th>{lang.actions}</th>
          </tr>
          {apiData?.length ?
            apiData?.map((data) => {
              return (
                <tr className='text-app pt-2 text-left py-3 tabBorder' key={data._id}>
                  <td className='p-3'>
                    <Image
                      src={s3ImageLinkGen(S3_IMG_LINK, data.creatorDetails.profilePic, 100, 200, 200)}
                      style={{
                        borderRadius: "50%",
                        maxWidth: "42px",
                        maxHeight: "42px",
                      }}
                    />
            </td>
                  <td>{formatDate(data.requestedAt, "MMM D,  YYYY h:mm a")}</td>
                  <td>{data.creatorDetails.firstName} {data.creatorDetails.lastName}</td>
                  <td className='hoverName' onClick={() => router.push(`https://testbombshellsite.com/${data.creatorDetails.username}`)}>@{data.creatorDetails.username}</td>
                  <td>{data.commissionPercentage}%</td>
                  <td className='width16 text-break'>{data.description ? <ShowMore count={50} text={data.description} /> : lang.na} </td>
            <td>
              <div className='d-flex flex-row justify-content-start'>
                      <Tooltip title={lang.changeEmployee} placement="top">
                        <div>
                <Icon
                  icon={`${ADMININFO}#admininfo`}
                  width={35}
                  height={35}
                        class="cursorPtr"
                  onClick={() => {
                    open_dialog("changeEmployee", {
                      isAdminInfo: true,
                      employeeData: employeeData,
                      agencyUserIds: data.agencyUserIds,
                      creatorId: data.creatorId
                    })
                  }}
                />
                        </div>
                      </Tooltip>
                      <Tooltip title={lang.statusLog} placement="top">
                        <div>
                <Icon
                  icon={`${ADMINLOG}#log`}
                  width={35}
                  height={35}
                        class="pl-2 cursorPtr"
                        onClick={() => {
                          Router.push(`/statusLog?CreatorId=${data.creatorId}&isEmployee=${false}`);
                        }}
                />
                        </div>
                      </Tooltip>
                    </div>
            </td>
          </tr>
              )
            })
            : ""}
        </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
          <p className='text-app text-center bold fntSz24'>No Pending Admin Approval Found!</p>
        </div>
        }
        <style jsx>{`
       td:first-child,
       th:first-child {
         border-radius: 10px 0 0 10px;
       }
       td:last-child,
       th:last-child {
         border-radius: 0 10px 10px 0;
       }
        `}</style>
      </div>
        <PaginationIndicator
          id="pendingTab"
          totalData={apiData}
          totalCount={totalPostCount}
          pageEventHandler={() => handlePageEvent(1)}
        />
      </div>
    )
  }
  const LinkedAccepted = () => {
    return (
      <div>
        <div id="linkedTab" className='w-100' style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.requestedOn}</th>
            <th>{lang.creatorName}</th>
            <th>{lang.creatoruName}</th>
            <th>{lang.commission}</th>
            <th>{lang.description}</th>
            <th>{lang.actions}</th>
          </tr>
          {apiData?.length ?
            apiData?.map((data) => {
              return (
                <tr className='text-app pt-2 text-left py-3 tabBorder' key={data._id}>
                  <td className='p-3'>
                    <Image
                      src={s3ImageLinkGen(S3_IMG_LINK, data.creatorDetails.profilePic, 100, 200, 200)}
                      style={{
                        borderRadius: "50%",
                        maxWidth: "42px",
                        maxHeight: "42px",
                      }}
                    />
            </td>
                  <td>{formatDate(data.requestedAt, "MMM D,  YYYY h:mm a")}</td>
                  <td>{data.creatorDetails.firstName} {data.creatorDetails.lastName}</td>
                  <td className='hoverName' onClick={() => router.push(`https://testbombshellsite.com/${data.creatorDetails.username}`)}>@{data.creatorDetails.username}</td>
                  <td>{data.commissionPercentage}%</td>
                  <td className='width16 text-break'>{data.description ? <ShowMore count={50} text={data.description} /> : lang.na} </td>
            <td>
              <div className='d-flex flex-row justify-content-start'>
                      <Tooltip title={lang.unlink} placement="top">
                        <div>
                <Icon
                  icon={`${LINKAGENCY}#link`}
                  width={35}
                  height={35}
                        class="cursorPtr"
                  onClick={() => {
                    open_dialog("reasonAgency", {
                      text: "Unlink Creator Profile",
                      btnText: "Confirm & Unlink",
                      id: data.creatorId,
                      status: "UNLINKED",
                      isCreator: true
                    })
                  }}
                />
                        </div>
                      </Tooltip>
                      <Tooltip title={lang.changeEmployee} placement="top">
                        <div>
                <Icon
                  icon={`${ADMININFO}#admininfo`}
                  width={35}
                  height={35}
                        class="pl-2 cursorPtr"
                        onClick={() => {
                          open_dialog("changeEmployee", {
                            isAdminInfo: true,
                            employeeData: employeeData,
                            agencyUserIds: data.agencyUserIds,
                            creatorId: data.creatorId
                          })
                        }}
                />
                        </div>
                      </Tooltip>
                      <Tooltip title={lang.statusLog} placement="top">
                        <div>
                <Icon
                  icon={`${ADMINLOG}#log`}
                  width={35}
                  height={35}
                        class="pl-2 cursorPtr"
                        onClick={() => {
                          Router.push(`/statusLog?CreatorId=${data.creatorId}&isEmployee=${false}`);
                        }}
                />
                        </div>
                      </Tooltip>
                    </div>
            </td>
                </tr>)
            }) : ""}
        </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
          <p className='text-app text-center bold fntSz24'>No Linked/Accepted Found!</p>
        </div>
        }
        <style jsx>{`
       td:first-child,
       th:first-child {
         border-radius: 10px 0 0 10px;
       }
       td:last-child,
       th:last-child {
         border-radius: 0 10px 10px 0;
       }
        `}</style>
      </div>
        <PaginationIndicator
          id="linkedTab"
          totalData={apiData}
          totalCount={totalPostCount}
          pageEventHandler={() => handlePageEvent(2)}
        />
      </div>
    )
  }
  const UnlinlinkedRejected = () => {
    return (
      <div>
        <div className='w-100' id="unlinkTab" style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.requestedOn}</th>
            <th>{lang.creatorName}</th>
            <th>{lang.creatoruName}</th>
            <th>{lang.commission}</th>
            <th>{lang.description}</th>
            <th>{lang.actions}</th>
          </tr>
          {apiData?.length ?
            apiData?.map((data) => {
              return (
                <tr className='text-app pt-2 text-left py-3 tabBorder' key={data._id}>
                  <td className='p-3'>
                    <Image
                      src={s3ImageLinkGen(S3_IMG_LINK, data.creatorDetails.profilePic, 100, 200, 200)}
                      style={{
                        borderRadius: "50%",
                        maxWidth: "42px",
                        maxHeight: "42px",
                      }}
                    />
                  </td>
                  <td>{formatDate(data.requestedAt, "MMM D,  YYYY h:mm a")}</td>
                  <td>{data.creatorDetails.firstName} {data.creatorDetails.lastName}</td>
                  <td className='hoverName' onClick={() => router.push(`https://testbombshellsite.com/${data.creatorDetails.username}`)}>@{data.creatorDetails.username}</td>
                  <td>{data.commissionPercentage}%</td>
                  <td className='width16 text-break'>{data.description ? <ShowMore count={50} text={data.description} /> : lang.na} </td>
                  <td>
                    <div className='d-flex flex-row justify-content-start'>
                      <Tooltip title={lang.statusLog} placement="top">
                        <div>
                      <Icon
                        icon={`${ADMINLOG}#log`}
                        width={35}
                        height={35}
                        class="cursorPtr"
                        onClick={() => {
                          Router.push(`/statusLog?CreatorId=${data.creatorId}&isEmployee=${false}`);
                        }}
                      />
                        </div>
                      </Tooltip>
                    </div>
                  </td>
                </tr>)
            })
            : ""}
        </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
          <p className='text-app text-center bold fntSz24'>No Unlinked/Rejected Found!</p>
        </div>
        }
        <style jsx>{`
       td:first-child,
       th:first-child {
         border-radius: 10px 0 0 10px;
       }
       td:last-child,
       th:last-child {
         border-radius: 0 10px 10px 0;
       }
        `}</style>
      </div>
        <PaginationIndicator
          id="unlinkTab"
          totalData={apiData}
          totalCount={totalPostCount}
          pageEventHandler={() => handlePageEvent(3)}
        />
      </div>
    )
  }
  const Cancelled = () => {
    return (
      <div>
        <div id="cancelTab" className='w-100' style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.requestedOn}</th>
            <th>{lang.creatorName}</th>
            <th>{lang.creatoruName}</th>
            <th>{lang.commission}</th>
            <th>{lang.description}</th>
            <th>{lang.actions}</th>
          </tr>
            {apiData?.length ?
            apiData?.map((data) => {
              return (
                <tr className='text-app pt-2 text-left py-3 tabBorder' key={data._id}>
                  <td className='p-3'>
                    <Image
                      src={s3ImageLinkGen(S3_IMG_LINK, data.creatorDetails.profilePic, 100, 200, 200)}
                      style={{
                        borderRadius: "50%",
                        maxWidth: "42px",
                        maxHeight: "42px",
                      }}
                    />
                  </td>
                  <td>{formatDate(data.requestedAt, "MMM D,  YYYY h:mm a")}</td>
                  <td>{data.creatorDetails.firstName} {data.creatorDetails.lastName}</td>
                  <td className='hoverName' onClick={() => router.push(`${MAIN_DOMAIN}/${data.creatorDetails.username}`)}>@{data.creatorDetails.username}</td>
                  <td>{data.commissionPercentage}%</td>
                  <td className='width16 text-break'>{data.description ? <ShowMore count={50} text={data.description} /> : lang.na} </td>
                  <td>
                    <div className='d-flex flex-row justify-content-start'>
                      <Tooltip title={lang.statusLog} placement="top">
                        <div>
                      <Icon
                        icon={`${ADMINLOG}#log`}
                        width={35}
                        height={35}
                        class="cursorPtr"
                        onClick={() => {
                          Router.push(`/statusLog?CreatorId=${data.creatorId}&isEmployee=${false}`);
                        }}
                      />
                        </div>
                      </Tooltip>
                    </div>
                  </td>
                </tr>)
            })
              : ""}
        </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
          <p className='text-app text-center bold fntSz24'>No Cancelled Found!</p>
        </div>
        }
        <style jsx>{`
       td:first-child,
       th:first-child {
         border-radius: 10px 0 0 10px;
       }
       td:last-child,
       th:last-child {
         border-radius: 0 10px 10px 0;
       }
        `}</style>
      </div>
        <PaginationIndicator
          id="cancelTab"
          totalData={apiData}
          totalCount={totalPostCount}
          pageEventHandler={() => handlePageEvent(4)}
        />
      </div>
    )
  }

  const TabsPanelFunction = () => {
    return (
      <>
        <TabPanel value={value} index={0}>
          <NewRequest />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PendingAdmin />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <LinkedAccepted />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <UnlinlinkedRejected />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Cancelled />
        </TabPanel>
      </>
    );
  };
  return (
    <div className='card_bg vh-100 rightside px-4'>
      <div className='pt-4'>
        <h3 className='text-app bold'>Agency Creators</h3>
      </div>
      <div className='my-4 borderall col-12'>
        <div className='col-11' style={{ height: "10vh" }} ><Paper>{TabsFunction()}</Paper></div>
        {TabsPanelFunction()}
      </div>
      <style jsx>{`
      :global(.borderall .MuiTabs-indicator){
        background:none !important;
      }
      :global(.borderall .Mui-selected){
        color:#C726F2 !important;
      }
      :global(.borderall .MuiTab-textColorInherit){
        color:var(--l_app_text);
      }
      :global(.tableHeader){
        background: var(--l_border);
        color:var(--l_app_text);
        top:0;
        z-index:1;
        position:sticky;
      }
      :global(.tabBorder){
        border-bottom:1px solid #EAE5E7;
      }
      :global(.tabBorder:hover){
        border-bottom:2px solid #FE6FA6;
      }
      :global(.borderall .MuiPaper-root){
        box-shadow:none !important;
        border-radius:12px !important;
        background-color:var(--l_profileCard_bgColor);
      }
      :global(.borderall){
        border:1px solid var(--l_border);
        border-radius:12px;
        height:87vh;
        background-color:var(--l_profileCard_bgColor);
      }
      .rightside{
        width:100%;
      }
      :global(.MuiTab-wrapper){
        justify-content:start !important;
        align-items:start !important;
      }
      :global(.hoverName:hover){
        color:var(--l_base);
        text-decoration:underline;
        cursor:pointer;
      }
      :global(.width16){
        width:calc(100% / 6);
      }
      `}</style>
    </div>
  )
}

export default CreatorAgency