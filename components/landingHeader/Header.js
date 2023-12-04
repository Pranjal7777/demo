import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Icon from "../../components/image/icon";
import { JUICY_HEADER_LOGO, MENUBAR_ICON } from "../../lib/config";
import { open_drawer } from "../../lib/global";
import { useTheme } from "react-jss";
import { Dark_moon, White_sunny } from "../../lib/config/header";
import Image from "../../components/image/image";

function Header(props) {
  const router = useRouter();
  const theme = useTheme();
  const [actionJoin, setActionJoin] = useState(false);

  const hrefUrls = [
    { text: "Home", url: "/" },
    { text: "Who We Are", url: "/who-we-are" },
    { text: "Affiliates", url: "/affiliates" },
    { text: "Agency", url: "/agency" },
    { text: "Blog", url: "/blog" },
    { text: "Support", url: "/support" },
  ];

  const handleGuestNavigationMenu = () => {
    open_drawer("JuicyGuestNavMenu", { paperClass: "backNavMenu" }, "left");
  };

  const handleSignup = (url) => {
    window.open(String(url), '_self');
    setActionJoin(false)
  }

  return (
    <div
      className="sticky-top pl-2 pl-sm-4 pr-0 pr-sm-2 specific_section_bg text-app borderBtm"
    >
      <header className="d-flex flex-row align-items-center justify-content-between h-100">
        <div className="nav_left  d-flex flex-row align-items-center float-left">
          <div className="d-block d-lg-none mx-2">
            <Icon
              icon={`${MENUBAR_ICON}#menubaricon`}
              viewBox="0 0 24 24"
              width="22"
              height="22"
              onClick={() => handleGuestNavigationMenu()}
            />
          </div>
          <div>
            <img
              src={`${JUICY_HEADER_LOGO}`}
              // viewBox="0 0 96 45"
              width="90"
              height="40"
            />
          </div>
          <ul className="d-lg-flex flex-row align-items-center d-none pl-3">
            {hrefUrls?.map((urls, index) => {
              return (
                <li
                  className='position-relative'>
                  <a href={urls?.url}>{urls?.text}</a>
                  <div style={{
                    border: `1.5px solid ${router?.asPath === urls?.url ? '#ff71a4' : 'transparent'}`,
                    borderTopLeftRadius: '50px',
                    borderTopRightRadius: '50px',
                    position: 'absolute',
                    width: '100%',
                    bottom: '0px',
                    lineHeight: '20px',
                  }}></div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="d-flex flex-row align-items-center float-right">
          {/* <div className="mx-3 cursorPtr rounded-pill p-1" style={{ border: '1px solid var(--l_border)' }}>
            {theme?.type === "light" ? (
              <Image
                src={Dark_moon}
                width="24"
                height="24"
                onClick={(e) => props?.changeTheme(e)}
              />
            ) : (
              <Image
                src={White_sunny}
                width="24"
                height="24"
                onClick={(e) => props?.changeTheme(e)}
              />
            )}
          </div> */}
          <div className="nav_right">
            <Button
              type="submit"
              className="px-3 text-white text-capitalize"
              style={{
                background: "none",
                border: "1px solid #404040",
                borderRadius: "24px",
                letterSpacing: "0.4px",
                fontSize: "0.65rem",
              }}
              onClick={() => window.open('/login', '_self')}
            >
              Log In
            </Button>
            <div className="position-relative" onMouseLeave={() => setActionJoin(false)}>
              <div onMouseOver={() => setActionJoin(true)}>
                <Button
                  type="submit"
                  className="px-3 text-white text-capitalize"
                  style={{
                    background: "var(--l_base)",
                    borderRadius: "24px",
                    letterSpacing: "0.4px",
                    fontSize: "0.65rem",
                  }}
                >
                  Join Now
                </Button>
                <div>
                  {/* {actionJoin && <div className="vh-100 position-fixed dropdown_backdrop" onClick={()=>setActionJoin(!actionJoin)}></div>} */}
                  <div className={`position-absolute ${!actionJoin && 'd-none'}`} style={{ right: '0px', top: '4.2rem', zIndex: '999' }}>
                    <span className="square_box_bg_none"></span>
                    <span className="square_box_bg"></span>
                    <ul className="dropdown_list_box text-center">
                      <li className="" onClick={() => handleSignup('/signup-as-user')}>Signup as a User</li>
                      <li className="border-0" onClick={() => handleSignup('/signup-as-creator')}>Signup as a Creator</li>
                      {/* <li className="border-0">Signup as an affliliate</li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <style>{`
            .nav_left{
              max-height: 68px;
              min-height: 68px;
            }
            .nav_left ul{
                list-style-type: none;
                margin-bottom: 0px;
            }
            .nav_left ul li{
              margin: 0px 8px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 68px;              
            }
            .nav_left ul li a {
                color: #ffffff !important;
                text-decoration: none;
                white-space: nowrap;
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.35px;
                padding: 24px 10px;
                line-height: 20px;
            }
            .nav_right{
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 12px;
                font-size: 13px !important;
                padding: 10px 0px;
            }
            .nav_right button{
              font-size: 0.65rem !important;
              line-height: 1.72 !important;
            }
            .login{
                border: 1px solid #404040 !important;
            }
            .join{
                background-color: #ff71a4;
            }
            .dropdown_list_box{
              background: rgba(0, 0, 0, 0.32);
              backdrop-filter: blur(4px);
              border-radius: 13px;
              width: max-content;
              padding: 0px;
            }
            .dropdown_list_box li{
              list-style: none;
              padding: 14px 55px;
              border-bottom: 1.5px solid #6B6B7D59;
              color: #F8F8F8;
              font-weight: 500;
              letter-spacing: 0.49996px;
              cursor: pointer;
              font-size: 14.5px;
            }
            .square_box_bg{
              position: absolute;
              right: 28px;
              top: -14px;
              backdrop-filter: blur(4px);
              width: 0; 
              height: 0; 
              border-left: 16px solid transparent;
              border-right: 16px solid transparent;
              border-bottom: 13.5px solid rgba(0, 0, 0, 0.32);
            }
            .square_box_bg_none{
              position: absolute;
              right: 0px;
              top: -2.3rem;
              width: 7rem; 
              height: 3rem; 
              background: none;
            }
            .dropdown_backdrop{
              z-index: 1;
              top: 0px;
              right: 0px;
              background: transparent;
              // backdrop-filter: blur(2px);
              width: 100vw;
            }
            @media (max-width: 575.98px){
              .nav_left {
                max-height: 68px;
                min-height: 68px;
              }
            }
        `}</style>
    </div>
  );
}

export default Header;
