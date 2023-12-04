import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AvatarImage from "../../components/image/AvatarImage";
import { open_drawer, startPageLoader, stopLoader, stopPageLoader } from "../../lib/global";
import { sendUpdates } from "../../services/chat";
import * as env from "../../lib/config";
import moment from "moment";
import { useTheme } from "react-jss";
import { appUpdateBot } from "../../redux/actions/auth"
import isMobile from "../../hooks/isMobile";

const UpdateListTile = (props) => {
  const dispatch = useDispatch();
  const APP_UPDATE_BOT = useSelector((state) => state?.appUpdateBot);
  const isMessageRead = useSelector((state) => state.profileData?.universalMessageRead);
  const [page, setPage] = useState(0);
  const theme = useTheme();
  const [mobileView] = isMobile();

  const getBotChat = async (pageCount = 0, loader) => {
    if (loader) startPageLoader();

    try {
      const payload = {
        limit: 10,
        offset: pageCount * 10,
      }

      // API Call
      const res = await sendUpdates(payload);

      // dispatch(appUpdateBot(res?.data?.data?.sendUpdates))

      if (res?.status == 200) {
        // this.setState({ page: pageCount })
        setPage(pageCount);

        if (payload.offset == 0) {
          dispatch(appUpdateBot(res?.data?.data?.sendUpdates.reverse()))
        } else {
          dispatch(appUpdateBot([...APP_UPDATE_BOT, ...res?.data?.data?.sendUpdates.reverse()]))
        }
        stopPageLoader();
        return;
      }
      stopLoader();
      // setIsLoading(false);

    } catch (err) {
      console.error("ERROR IN getBotChat", err);
      stopLoader()
    }
  }

  useEffect(() => {
    getBotChat();
  }, [props.active])

  return (
    <>
      {mobileView
        ? <li
          className="nav-item userListStyle"
          onClick={() => {
            open_drawer("BotMessage", {
            botChats: APP_UPDATE_BOT
          }, "right");
          props.handleUpdatesAcknowledged?.();
        }}
        >
          <a className="nav-link w-100 py-0" data-toggle="pill" href="#">
            <div className="row align-items-end">
              <div className="col-12 px-2">
                <div className="form-row align-items-center">
                  <div className="col-auto">
                    <AvatarImage src={env.FAV_ICON36} alt="voyr_lens" />
                    {/* <span className="mv_online_true" /> */}
                  </div>
                  <div className="col pl-3 py-2" style={{borderBottom: "1.5px solid var(--l_border)"}}>
                    <div className="row justify-content-between">
                      <div className="col-auto">
                        <div className="mv_chat_pro_name">{env.APP_NAME}</div>
                      </div>
                      {!isMessageRead && <div className="notification-dot position-absolute" style={{right: "0px"}}></div>}
                    </div>
                    <div className="row justify-content-between">
                      <div className="col-9 pr-0">
                        <div className="mv_chat_pro_status">
                          <div className="d-flex">
                            {/* {senderId == userData._id && ( */}
                            <div className="d-flex mt-1 mr-2">
                              {/* {messageStatus(status)} */}
                              Click here for all updates
                            </div>
                            {/* )} */}
                            {/* <div
                            className="font-weight-500 gray c-message word-break"
                            style={{ fontSize: "11px" }}
                          > */}
                            {/* {mobileView
                              ? checkMessageType(props.messageType).length > 67
                                ? `${checkMessageType(props.messageType).slice(
                                  0,
                                  67
                                )}...`
                                : checkMessageType(props.messageType)
                              : checkMessageType(props.messageType).length > 96
                                ? `${checkMessageType(props.messageType).slice(
                                  0,
                                  96
                                )}...`
                                : checkMessageType(props.messageType)} */}
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="col-3 pl-0 text-right">
                        <div className="mv_chat_pro_status">
                          {APP_UPDATE_BOT?.length ? moment(APP_UPDATE_BOT[APP_UPDATE_BOT?.length - 1]?.createdTs).format("DD MMM") : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </li>
        : <li
          className={`${props.clasName ? "selectedUser " : ""}nav-item ${props.active ? "selectedUser userListStyle" : ""}`}
          style={{ listStyle: "none" }}
          onClick={() => {
            props.isBotChat();
            props.handleUpdatesAcknowledged?.();
          }}
        >
          <a className="nav-link w-100 py-0" data-toggle="pill" href="#">
            <div className="row align-items-end">
              <div className="col-12 px-3">
                <div className="form-row align-items-center">
                  <div className="col-auto">
                    <AvatarImage src={env.FAV_ICON36} alt="app logo" />
                    {/* <span className="mv_online_true" /> */}
                  </div>
                  <div className="col pl-3 py-2" style={{borderBottom: "1.5px solid var(--l_border)"}}>
                    <div className="row justify-content-between">
                      <div className="col-auto">
                        <div className="mv_chat_pro_name">{env.APP_NAME}</div>
                      </div>
                      {!isMessageRead && <div className="notification-dot position-absolute" style={{right: "0px"}}></div> }
                    </div>
                    <div className="row justify-content-between">
                      <div className="col-9 pr-0">
                        <div className="mv_chat_pro_status">
                          <div className="d-flex">
                            <div className="d-flex mt-1 mr-2">
                              Click here for all updates
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 pl-0 text-right">
                        <div className="mv_chat_pro_status">
                          {APP_UPDATE_BOT?.length ? moment(APP_UPDATE_BOT[APP_UPDATE_BOT?.length - 1]?.createdTs).format("DD MMM") : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
          <style jsx>{`
            .selectedUser{
              background-color: ${theme.type === "light"
              ? theme.palette.l_input_bg
              : theme.palette.d_input_bg}
            }
          `}
          </style>
        </li>
      }
    </>
  )
}

export default UpdateListTile
