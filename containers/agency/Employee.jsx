import dynamic from 'next/dynamic';
import React from 'react'
import { useTheme } from 'react-jss';
import { ADMINLOG } from '../../lib/config/logo';
import Icon from '../../components/image/icon';
import { open_dialog } from '../../lib/global';
import Button from '../../components/button/button';
import { BLOCK_AG, DELETE_AG, DEVICE, RELOAD_AG, USER_AG } from '../../lib/config/homepage';
import Router, { useRouter } from 'next/router';
import useEmployee from './hook/useEmployee';
import Image from '../../components/image/image';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
import { formatDate } from '../../lib/date-operation/date-operation';
import useLang from '../../hooks/language';
import { Tooltip } from '@material-ui/core';
import PaginationIndicator from '../../components/pagination/paginationIndicator';
import { NO_DATA_PLACEHOLDER } from '../../lib/config/placeholder';
import { handleContextMenu } from '../../lib/helper';
const Paper = dynamic(() => import("@material-ui/core/Paper"));
const Tab = dynamic(() => import("@material-ui/core/Tab"));
const Tabs = dynamic(() => import("@material-ui/core/Tabs"));


const Employee = () => {
  const theme = useTheme();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const apiData = useSelector((state) => state?.allEmployeeData);
  const router = useRouter()
  const {
    value,
    totalPostCount,
    handleAccept,
    handleTab,
    handlePageEvent,
  } = useEmployee();
  const [lang] = useLang();

  const TabsFunction = () => {
    return (
      <Tabs
        value={value}
        onChange={handleTab}
        TabIndicatorProps={{ style: { background: theme.appColor, height: "3px" } }}
      >
        <Tab
          className="text-capitalize font-weight-bold fntSz20"
          label={lang.active}
        />
        <Tab
          className="text-capitalize font-weight-bold fntSz20"
          label={lang.suspend}
        />
        <Tab
          className="text-capitalize font-weight-bold fntSz20"
          label={lang.deleted}
        />
      </Tabs>
    );
  };
  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && <div style={{ height: '89%' }}>{children}</div>}</>;
  };
  const profileDeatilHandler = (id, admin) => {
    if (admin === "ADMIN") {
      router.push('/agencyMyprofile')
    } else {
      router.push(`/addEmployee?id=${id}`)
    }
  }
  const Active = () => {
    return (
      <>
        <div className='w-100' id="activeTab" style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.createdOn}</th>
            <th>{lang.employeeName}</th>
            <th>{lang.role}</th>
            <th>{lang.Email}</th>
            <th>{lang.phone}</th>
            <th>{lang.actions}</th>
          </tr>
          {apiData?.map((item, index) => (
            <tr className='text-app pt-2 text-left py-3 tabBorder' key={item._id}>
              <td className='p-3 className'>
                <Image
                  src={s3ImageLinkGen(S3_IMG_LINK, item.profilePic, 100, 200, 200)}
                  style={{
                    borderRadius: "50%",
                    maxWidth: "42px",
                    maxHeight: "42px",
                  }}
                />
              </td>
              <td>{formatDate(item.creationTs, "MMM D,  YYYY h:mm a")}</td>
              <td className='hoverName' onClick={() => profileDeatilHandler(item._id, item.userRole)}>{item.firstName} {item.lastName}</td>
              <td>{item.userRole}</td>
              <td>{item.email}</td>
              <td>{item.countryCode} {item.phoneNumber}</td>
              <td>
                <div className={`d-flex flex-row ${item.userRole !== "ADMIN" ? "justify-content-around" : "justify-content-start"}`}>
                  <Tooltip title={lang.deviceLog} placement="top">
                    <div>
                  <Icon
                    icon={`${DEVICE}#device`}
                    width={35}
                    height={35}
                        class={`cursorPtr ${item.userRole === "ADMIN" && "px-2"}`}
                    onClick={() => {
                      Router.push(`/deviceLog?CreatorId=${item._id}&isEmployee=${true}`);
                    }}
                  />
                    </div>
                  </Tooltip>
                  {item.userRole !== "ADMIN" &&
                    <Tooltip title={lang.suspended} placement="top">
                      <div>
                        <Icon
                    icon={`${BLOCK_AG}#block`}
                    width={35}
                    height={35}
                    class="cursorPtr"
                    onClick={() => {
                      open_dialog("reasonAgency", {
                        text: "Are you sure you want to suspend this Employee?",
                        btnText: "Confirm Suspend",
                        status: "SUSPENDED",
                        id: item._id,
                        tab: 0
                      });
                    }}
                        />
                      </div>
                    </Tooltip>
                  }
                  {item.userRole !== "ADMIN" &&
                    <Tooltip title={lang.delete} placement="top">
                      <div>
                        <Icon
                    icon={`${DELETE_AG}#delete`}
                    width={35}
                    height={35}
                    class="cursorPtr"
                    onClick={() => {
                      open_dialog("reasonAgency", {
                        text: "Are you sure you want to delete this Employee?",
                        btnText: "Confirm Delete",
                        status: "DELETED",
                        id: item._id,
                        tab: 0
                      });
                    }}
                        />
                      </div>
                    </Tooltip>}
                  <Tooltip title={lang.statusLog} placement="top">
                    <div>
                  <Icon
                    icon={`${ADMINLOG}#log`}
                    width={35}
                    height={35}
                    class="cursorPtr"
                    onClick={() => {
                      Router.push(`/statusLog?CreatorId=${item._id}&isEmployee=${true}`);
                    }}
                  />
                    </div>
                  </Tooltip>
                  {item.userRole !== "ADMIN" &&
                    <Tooltip title={lang.resetPassword} placement="top">
                      <div>
                        <Icon
                    icon={`${RELOAD_AG}#reload`}
                    width={35}
                    height={35}
                    class="cursorPtr"
                    onClick={() => {
                      open_dialog("reasonAgency", {
                        text: "Are you sure ? you want to Reset Password",
                        btnText: "Confirm Reset Password",
                        restPassword: true,
                        agencyUserId: item._id,
                        tab: 0
                      });
                    }}
                        />
                      </div>
                    </Tooltip>
                  }
                </div>
              </td>
            </tr>
          ))}
        </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
            <p className='text-app text-center bold fntSz24'>{lang.noactive}</p>
          </div>}
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
          id="activeTab"
          totalData={apiData}
          totalCount={totalPostCount}
          pageEventHandler={() => handlePageEvent(0)}
        />
      </>
    )
  }
  const Suspended = () => {
    return (
      <div>
        <div className='w-100' id="deleteTab" style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.suspendon}</th>
            <th>{lang.employeeName}</th>
            <th>{lang.role}</th>
            <th>{lang.Email}</th>
            <th>{lang.phone}</th>
            <th>{lang.actions}</th>
          </tr>
          {apiData?.map((item, index) => (<tr className='text-app pt-2 text-left py-3 tabBorder' key={item._id}>
            <td className='p-3'>
              <Image
                src={s3ImageLinkGen(S3_IMG_LINK, item.profilePic, 100, 200, 200)}
                style={{
                  borderRadius: "50%",
                  maxWidth: "42px",
                  maxHeight: "42px",
                }}
              />
            </td>
            <td>{formatDate(item.creationTs, "MMM D,  YYYY h:mm a")}</td>
            <td>{item.firstName} {item.lastName}</td>
            <td>{item.userRole}</td>
            <td>{item.email}</td>
            <td>{item.countryCode} {item.phoneNumber}</td>
            <td>
              <div className='d-flex flex-row justify-content-around'>
                <Tooltip title={lang.deviceLog} placement="top">
                  <div>
                <Icon
                  icon={`${DEVICE}#device`}
                  width={35}
                  height={35}
                  class={`cursorPtr ${item.userRole === "ADMIN" && "pr-3"}`}
                // onClick={() => {
                //   open_dialog("assignEmployee")
                // }}
                />
                  </div>
                </Tooltip>
                {item.userRole !== "ADMIN" &&
                  <Tooltip title={lang.active} placement="top">
                    <div>
                      <Icon
                  icon={`${USER_AG}#user`}
                  width={35}
                  height={35}
                  class="cursorPtr"
                  onClick={() => open_dialog("confirmDialog", {
                    title: "Are you sure you want to make this employee active?",
                    submitT: "Active",
                    cancelT: "Cancel",
                    tab: 1,
                    yes: () => handleAccept("ACTIVE", item._id)
                  })}
                      />
                    </div>
                  </Tooltip>
                }
                {item.userRole !== "ADMIN" &&
                  <Tooltip title={lang.delete} placement="top">
                    <div>
                      <Icon
                  icon={`${DELETE_AG}#delete`}
                  width={35}
                  height={35}
                  class="cursorPtr"
                  onClick={() => {
                    open_dialog("reasonAgency", {
                      text: "Are you Sure ? you want to Delete this Employee",
                      btnText: "Confirm Delete",
                      status: "DELETED",
                      id: item._id,
                      tab: 1,
                    });
                  }}
                      />
                    </div>
                  </Tooltip>}
                <Tooltip title={lang.statusLog} placement="top">
                  <div>
                <Icon
                  icon={`${ADMINLOG}#log`}
                  width={35}
                  height={35}
                  class="cursorPtr"
                  onClick={() => {
                    Router.push(`/statusLog?CreatorId=${item._id}&isEmployee=${true}`);
                  }}
                />
                  </div>
                </Tooltip>
                {item.userRole !== "ADMIN" &&
                  <Tooltip title={lang.resetPassword} placement="top">
                    <div>
                      <Icon
                  icon={`${RELOAD_AG}#reload`}
                  width={35}
                  height={35}
                  class="cursorPtr"
                  onClick={() => {
                    open_dialog("reasonAgency", {
                      text: "Are you sure ? you want to Reset Password",
                      btnText: "Confirm Reset Password",
                      restPassword: true,
                      agencyUserId: item._id,
                      tab: 1,
                    });
                  }}
                      />
                    </div>
                  </Tooltip>
                }
              </div>
            </td>
          </tr>))}
        </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
            <p className='text-app text-center bold fntSz24'>{lang.nosuspend}</p>
          </div>}
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
          id="deleteTab"
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
        <div className='w-100' id="deleteTab" style={{ overflowY: "auto", height: "76vh" }}>
        <table className='col-12'>
          <tr className='tableHeader '>
            <th className='p-3'>{lang.profilePic}</th>
            <th>{lang.createdOn}</th>
            <th>{lang.deletedOn}</th>
            <th>{lang.employeeName}</th>
            <th>{lang.role}</th>
            <th>{lang.Email}</th>
            <th>{lang.phone}</th>
            <th>{lang.actions}</th>
          </tr>
            {apiData?.map((item, index) => (<tr className='text-app pt-2 text-left py-3 tabBorder' key={item._id}>
            <td className='p-3'>
              <Image
                src={s3ImageLinkGen(S3_IMG_LINK, item.profilePic, 100, 200, 200)}
                style={{
                  borderRadius: "50%",
                  maxWidth: "42px",
                  maxHeight: "42px",
                }}
              />
            </td>
            <td>{formatDate(item.creationTs, "MMM D,  YYYY h:mm a")}</td>
            <td>{formatDate(item.updatedAt, "MMM D,  YYYY h:mm a")}</td>
            <td>{item.firstName} {item.lastName}</td>
            <td>{item.userRole}</td>
            <td>{item.email}</td>
            <td>{item.countryCode} {item.phoneNumber}</td>
            <td>
              <div className='d-flex flex-row justify-content-start'>
                <Tooltip title={lang.deviceLog} placement="top">
                  <div>
                <Icon
                  icon={`${DEVICE}#device`}
                  width={35}
                  height={35}
                  class="pl-2 cursorPtr"
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
                    Router.push(`/statusLog?CreatorId=${item._id}&isEmployee=${true}`);
                  }}
                />
                  </div>
                </Tooltip>
              </div>
            </td>
          </tr>))}
        </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
            <p className='text-app text-center bold fntSz24'>{lang.nodleted}</p>
          </div>}
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
          id="deleteTab"
          totalData={apiData}
          totalCount={totalPostCount}
          pageEventHandler={() => handlePageEvent(2)}
        />
      </div>
    )
  }

  const TabsPanelFunction = () => {
    return (
      <>
        <TabPanel value={value} index={0}>
          <Active />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Suspended />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <LinkedAccepted />
        </TabPanel>
      </>
    );
  };
  return (
    <div className='card_bg vh-100 rightside px-4'>
      <div className='pt-4'>
        <h3 className='text-app bold'>Agency Employee</h3>
      </div>
      <div className='my-4 borderall col-12'>
        <div className='col-11 position-relative' style={{ height: "10vh" }}><Paper>{TabsFunction()}</Paper></div>
        <div className='position-absolute px-3' style={{ top: "0.5rem", right: "0", zIndex: "1" }}>
          <Button
            fclassname="py-2 px-3 btnGradient_bg radius_22"
            btnSpanClass="fntSz12"
            type="button"
            onClick={() => Router.push('/addEmployee')}
          >Add Employee</Button>
        </div>
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
        border-radius:12px;
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
      :global(.MuiTab-root){
        min-width:0 !important;
      }
      :global(.hoverName:hover){
        color:var(--l_base);
        text-decoration:underline;
        cursor:pointer;
      }
      `}</style>
    </div>
  )
}

export default Employee