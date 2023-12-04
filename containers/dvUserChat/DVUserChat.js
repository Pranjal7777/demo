import React from "react";
import * as config from "../../lib/config";
import useLang from "../../hooks/language";
import Icon from "../../components/image/icon";
import Img from "../../components/ui/Img/Img";
import { useTheme } from "react-jss";

const DVUserChat = (props) => {
  const theme = useTheme();
  const [lang] = useLang();

  return (
    <>
      {/* // <div className="dv_wrap_home"> */}

      <div className="dv_header">
        <div className="col-12">
          <div className="row">
            <div className="container">
              <div className="row align-items-center justify-content-between py-3">
                <div className="col-auto">
                  <figure className="mb-0">
                    {/* <a href="index.html"> */}
                    <a
                      onClick={() => {
                        props.setVal(false);
                      }}
                    >
                      <Img
                        src={config.LOGO}
                        width={110}
                        height={44}
                        alt="logo"
                      />
                    </a>
                  </figure>
                </div>
                <div className="col-auto">
                  <figure className="mb-0">
                    <Img
                      src={config.NOTIFICATION_ICON}
                      width={20}
                      height
                      alt="notification"
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="row dv_base_bg_dark_color py-2">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-11">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-auto">
                      <figure className="mb-0">
                        {/* <a href="home_user.html"> */}
                        <a
                          onClick={() => {
                            props.setVal(true);
                            props.setChat(false);
                            props.setProfile(false);
                            props.setHome(true);
                          }}
                        >
                          <Icon
                            icon={`${config.HOME_ACTIVE}#Home_icon`}
                            color={props.home === true ? theme.l_base : "#fff"}
                            size={props.home === true ? 26 : 26}
                          />
                          {/* <Img src={config.DV_HOME_ACTIVE} width={26} alt="home" /> */}
                        </a>
                      </figure>
                    </div>
                    <div className="col-auto">
                      <figure className="mb-0">
                        <a href="#">
                          <Img src={config.DV_SEARCH} width={26} alt="search" />
                        </a>
                      </figure>
                    </div>
                    <div className="col-auto">
                      <figure className="mb-0">
                        {/* <a href="chat_user.html"> */}
                        <a
                          onClick={() => {
                            props.setChat(true);
                            props.setHome(false);
                          }}
                        >
                          <Icon
                            icon={`${config.CHAT_INACTIVE_ICON}#chat`}
                            color={props.chat ? theme.l_base : "#fff"}
                            size={props.chat ? 26 : 26}
                          />
                          {/* <Img src={config.DV_CHAT_INACTIVE_ICON} width={26} alt="chat" /> */}
                        </a>
                      </figure>
                    </div>
                    <div className="col-auto">
                      <figure className="mb-0">
                        {/* <a href="profile_user.html"> */}
                        <a
                          onClick={() => {
                            props.setProfile(true);
                          }}
                        >
                          <Icon
                            icon={`${config.PROFILE_INACTIVE_ICON}#profile`}
                            color={props.profile ? theme.l_base : "#fff"}
                            size={props.profile === true ? 26 : 26}
                          />
                          {/* <Img src={config.DV_PROFILE_INACTIVE_ICON} width={26} alt="profile" /> */}
                        </a>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dv_cont_posts">
        <div className="col-12">
          <div className="row">
            <div className="container">
              <div className="col-12 dv_base_bg_dark_color">
                <div className="row align-items-center py-2" id="chatSecHeader">
                  <div className="col-auto w_348">
                    <h6 className="dv_subHeader_title">{lang.chat}</h6>
                  </div>
                  <div className="col">
                    <div className="row justify-content-between align-items-center">
                      <div className="col-auto">
                        <div className="form-row align-items-center">
                          <div className="col-auto">
                            <Img
                              src={config.DV_CHAT_PROFILE}
                              width={54}
                              height={54}
                              className="live"
                              alt="chat"
                            />
                            <span className="dv_online_true" />
                          </div>
                          <div className="col">
                            <div className="dv_chat_pro_name">{lang.eliza}</div>
                            <div className="dv_chat_pro_status">
                              {lang.online}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <figure className="mb-0">
                          <Img
                            src={config.DV_CHAT_ICON}
                            width={14}
                            alt="chat"
                          />
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row ">
                  <div
                    className="col-auto w_348 pb-3 px-0 dv_chatSecContent"
                    id="chatSecList"
                    style={{ height: `calc(100vh - 220.594px)` }}
                  >
                    <ul className="nav nav-pills dv_chatlistUL mb-3">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-toggle="pill"
                          href="#allChats"
                        >
                          {lang.allChats}
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane active" id="allChats">
                        <ul className="nav flex-column nav-pills dv_chatUL">
                          <li className="nav-item">
                            <a
                              className="nav-link active"
                              data-toggle="pill"
                              href="#chat1"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT_PROFILE}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.eliza}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hi}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat2"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.elizabeth}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat3"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT3}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.sona}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <span className="dv_chat_count">
                                            {lang.num4}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat4"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT_PROFILE}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.eliza}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hi}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat5"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.elizabeth}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat6"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT3}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.sona}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <span className="dv_chat_count">
                                            {lang.num4}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat7"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT_PROFILE}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.eliza}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hi}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat8"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.elizabeth}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat9"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT3}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.sona}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <span className="dv_chat_count">
                                            {lang.num4}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat10"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT_PROFILE}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.eliza}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hi}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat11"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.elizabeth}
                                          </div>
                                        </div>
                                        <div className="col-auto"></div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              data-toggle="pill"
                              href="#chat12"
                            >
                              <div className="row align-items-end">
                                <div className="col-12">
                                  <div className="form-row align-items-center">
                                    <div className="col-auto">
                                      <Img
                                        src={config.DV_CHAT3}
                                        width={54}
                                        height={54}
                                        className="live"
                                        alt="chat"
                                      />
                                      <span className="dv_online_true" />
                                    </div>
                                    <div className="col">
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_name">
                                            {lang.sona}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <span className="dv_chat_count">
                                            {lang.num4}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="row justify-content-between">
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.hello}
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="dv_chat_pro_status">
                                            {lang.min}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col py-3 dv_base_bg_color dv_chatSecContent"
                    id="chatSecContent"
                    style={{ height: `calc(100vh - 220.594px)` }}
                  >
                    <div className="tab-content">
                      <div className="tab-pane active" id="chat1">
                        <div className="row">
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="chat2">
                        <div className="row">
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="chat3">
                        <div className="row">
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="chat4">
                        <div className="row">
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="chat5">
                        <div className="row">
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="chat6">
                        <div className="row">
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="chat7">
                        <div className="row">
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="chat8">
                        <div className="row">
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.hello}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num5}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.fine}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num5}{" "}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <div>
                              <span className="dv_chat_txt_sender">
                                {lang.meet}
                              </span>
                            </div>
                            <div className="dv_chat_time">{lang.num6}</div>
                          </div>
                          <div className="col-12 mb-2 text-right">
                            <div>
                              <span className="dv_chat_txt_sender dv_chat_txt_receiver">
                                {lang.time}
                              </span>
                            </div>
                            <div className="dv_chat_time">
                              {lang.num6}
                              <Img
                                src={config.DV_CHECK}
                                width={7}
                                alt="check"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // </div> */}
    </>
  );
};
export default DVUserChat;
