import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { FacebookIcon, InstagramIcon, SnapchatIcon, TelegramIcon, TikTokIcon, TwitterIcon, logo } from '../public/Bombshell/images/header/index';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logindropdown from './loginDropdown/loginDropDown';
import { Tooltip } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { handleContextMenu } from '../lib/helper';
import isMobile from '../hooks/isMobile';

const Header = () => {
  const [isOpenHamburger, setIsOpenHamburger] = useState(false);
  const outsideRef = useRef(null);
  const { asPath } = useRouter();
  
  const links=[
    {
      path:"/",
      name:"Home"
    }, 
    {
      path:"/about-us",
      name:"About Us"
    },
    {
      path:"/agency",
      name:"Agency"
    },
    // {
    //   path:"/blog",
    //   name:"Blog"
    // },
    {
      path:"/creator",
      name:"Creators"
    },
    {
      path:"/contact-us",
      name:"Contact Us"
    }
  ]
  
  useEffect(() => {
    function handleClickOutside(event) {
      event?.stopPropagation();
      const navContainer = document?.querySelector('.nav-container');
      if (outsideRef.current && !outsideRef.current.contains(event.target) && event?.target?.contains(navContainer)) {
        setIsOpenHamburger(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[]);

  useEffect(() => {
    isOpenHamburger ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
  },[isOpenHamburger]);

  const [mobileView] = isMobile();
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <header className="header">
        <div className="header-wrapper">
          <div className="menu callout-none" onContextMenu={handleContextMenu} >
            <div className={`hamburger ${isOpenHamburger ? 'open' : ''}`} onClick={(e) => {e.stopPropagation();setIsOpenHamburger(!isOpenHamburger)}}>
              <span className='line text-black'></span>
              <span className='line text-black'></span>
              <span className='line text-black'></span>
            </div>
            <Link href={'/'} passHref prefetch={false}><a className='logo-wrapper'>
              <Image src={logo} height={70} width={160} priority alt='Logo icon'  />
            </a></Link>
            <ul className="menus">
              {links.map((el,i)=>(
              <li key={i} ><Link href={el.path} passHref prefetch={false}><a className={`link text-black ${asPath === el.path ? 'active' : ''}`}>{el.name}</a></Link></li>
            ))}
            </ul>
          </div>
          <ul className="signup my-0">
            <li className='list-style-none'>
              <Link href={'/login'} passHref prefetch={false}><a className='link-btn pagebtn varient-2' data="Log in"></a></Link>
            </li>
            {mobileView ? ( 
               <ClickAwayListener onClickAway={handleTooltipClose}>
            <div style={{position:"relative"}}> 
              <Tooltip
                PopperProps={{
                  className: 'join-wrapper'
                }}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                open={open}
                title={<Logindropdown/>}
              >
               <li className='list-style-none' >
                <Link href={'#'} passHref prefetch={false}><a className='link-btn pagebtn varient-1' onClick={handleTooltipOpen}>Join</a></Link>
              </li>
              </Tooltip>
            </div>
            </ClickAwayListener>
          ) :(  <Tooltip PopperProps={{ className: 'join-wrapper'}}
            title={<Logindropdown/>}
            >
                <li className='list-style-none' >
                <Link href={'/signup-as-user'} passHref prefetch={false}><a className='link-btn pagebtn varient-1'>Join</a></Link>
              </li>
            </Tooltip>  )}
           
          </ul>
         
        </div>

      </header>
      <div className="nav-container">
      </div>
      <nav ref={outsideRef} className={`navbar ${isOpenHamburger ? 'open' : ''}`}>
        <ul className="links">
          {
            links.map((el,i)=>(
              <li>
              <Link href={el.path} passHref prefetch={false}><a className='navlink'>{el.name}</a></Link>
            </li>
            ))
          }
        
          {/* <li className='mt-1rem'>
            <Link href={'/#'} passHref prefetch={false}><a className='navlink'>Login</a></Link>
          </li>
          <li>
            <Link href={'/#'} passHref prefetch={false}><a className='navlink'>Sign up</a></Link>
          </li> */}
        </ul>
        <div className="social-media">
          <a href='https://www.facebook.com/bombshellinfluencers'><span className="icon-wrapper"><Image src={FacebookIcon} alt='facebook icon' height={16} width={16} /></span></a>
          <a href='https://www.instagram.com/bombshellinfluencers/'><span className="icon-wrapper"><Image src={InstagramIcon} alt='instagram icon' height={16} width={16} /></span></a>
          <a href='https://twitter.com/bombshellinflu'><span className="icon-wrapper"><Image src={TwitterIcon} alt='twitter icon' height={16} width={16} /></span></a>
          <a href='https://t.me/bombshellinfluencers'><span className="icon-wrapper"><Image src={TelegramIcon} alt='telegram icon' height={16} width={16} /></span></a>
          <a href='https://www.snapchat.com/add/bombshellinflu'><span className="icon-wrapper"><Image src={SnapchatIcon} alt='snapchat icon' height={16} width={16} /></span></a>
          <a href='https://www.tiktok.com/@bombshellinfluencers'><span className="icon-wrapper"><Image  src={TikTokIcon} alt='tiktok icon' height={16} width={16} /></span></a>
        </div>
      </nav>
      <style jsx>{`
     
        :global(.join-wrapper .MuiTooltip-tooltip.MuiTooltip-tooltipPlacementBottom) {
          background:white;
          //border:1px solid #D7D7D7;
        }
      
       
        .mt-1rem {
          margin-top: 16px;
        }
        .signup .pagebtn {
          height: clamp(30px,9vw,48px);
          width: clamp(65px,18vw,115px);
          font-size: clamp(15px,2.1vw,20px);
        }
        .link {
          font-size: clamp(15px, 1.7vw, 20px);
          color: var(--l_altertative_text_color);
          text-decoration: none;
        }
        .link.active {
          background: -webkit-linear-gradient(135deg, #D33AFF 0%, var(--title-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .list-style-none {
          list-style: none;
        }
        .link-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
        }
        .header {
          position: sticky;
          top: 0;
          background: var(--white);
          z-index: 10;
          display: flex;
          padding-inline: 1rem;
          border-bottom: 1px solid #D7D7D7;
          align-items: center;
          height: clamp(54px, 8vw, 100px);
        }
        .menu {
          display: flex;
          align-items: center;
        }
        .header-wrapper {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 1570px;
          margin: 0 auto;
        }
        .nav-container {
          position: fixed;
          z-index: 100;
          display: ${isOpenHamburger ? 'block' : 'none'};
          height: 100vh;
          width: 100vw;
          background: #0000001a;
        }
        .navbar {
          position: fixed;
          z-index: 100;
          width: 100%;
          max-width: 327px;
          height: 100vh;
          background-color: var(--white);
          transform: translateX(-100%);
          transition: all 0.3s ease;
          border-right: 1px solid #D7D7D7;
        }
        .menus {
          margin-left: clamp(20px, 3vw, 110px);
          display: flex;
          align-items: center;
          list-style: none;
          gap: clamp(5px, 2.5vw, 48px);
        }
        .signup {
          display: flex;
          align-items: center;
          gap: clamp(10px, 3vw, 40px);
          margin-block: auto;
        }
        .pagebtn {
          height: 58px;
          width: 115px;
          padding: 0;
        }
        .social-media {
          margin-top: 60px;
          display: flex;
          justify-content: center;
          padding: 12px 16px;
          gap: 1rem;
        }
        .icon-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D33AFF40 0%, #FF71A440 100%);
        }

        @media screen and (max-width: 1000px) {
          .signup {
            display: flex;
            gap: 12px;
            margin-right: 1rem;
            margin-block: auto;
          }
          .signup .pagebtn, .signup .pagebtn::before {
            border-radius: clamp(12px, 4vw, 25px);
          }
          .header {
            padding: 0;
          }
          .menus {
            display: none;
          }
          .logo-wrapper {
            width: 90px;
            height: 40px;
            margin: auto 0;
            font-size: initial;
          }
          .hamburger {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
            height: 24px;
            width: 24px;
            margin-inline: 1rem;
          }
          .line {
            display: block;
            height: 2px;
            width: 95%;
            background: #000;
            border-radius: 20px;
            transition: all .3s ease;
          }
          .line:nth-child(1) {
            top: 0px;
            transform-origin: 3px center;
          }
          .line:nth-child(2) {
            top: 18px;
            transform-origin: center center;
          }
          .line:nth-child(3) {
            top: 36px;
            transform-origin: 3px center;
          }
          .open .line:nth-child(1) {
            transform: rotate(45deg);
            top: -3px;
            left: 8px;
          }
          .open .line:nth-child(2) {
            width: 0%;
            opacity: 0;
          }
          .open .line:nth-child(3) {
            transform: rotate(-45deg);
            top: 39px;
            left: 8px;
          }
          .navbar.open {
            display: block;
            transform: translateX(0%);
          }
          .links {
            display: flex;
            flex-direction: column;
            list-style: none;
          }
          .navlink {
            display: inline-block;
            text-decoration: none;
            color: var(--l_altertative_text_color);
            padding: 12px 16px;
          }
         
        }
       
      `}</style>
    </>

  )
}

export default Header