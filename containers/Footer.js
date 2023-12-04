import Link from 'next/link'
import { lockIcon, shieldLockIcon } from '../public/Bombshell/images/footer/index'
import { FacebookIcon, InstagramIcon, SnapchatIcon, TelegramIcon, TwitterIcon, logoWhite, TikTokIcon } from '../public/Bombshell/images/header/index'
import Image from 'next/image'
import React from 'react'
import { newsletter } from '../services/auth'
import { Toast } from '../lib/global/loader'


const Footer = () => {
  const year = new Date().getFullYear()
  const [email, setEmail] = React.useState("");

  const postSubscribeMail = async (e) => {
    e.preventDefault();
    let payload = {
      email: email,
    }
    try {
      const res = await newsletter(payload);
      if (res.status === 200) {
        setEmail("")
        Toast("Thank you for applying to Subscribe", "success")
      }
    } catch (error) {
      console.log(error);
      setEmail("")
      Toast(error?.message, "error")
    }
  }
  return (
    <>
      <footer>
        <div className="footer">
          <div className="logo-wrapper">
            <Image className='footer-logo' src={logoWhite} alt='logo icon' height={110} width={250} />
            <div className="social-media">
              <a href='https://www.facebook.com/bombshellinfluencers'><span className="icon-wrapper"><Image className='icon' src={FacebookIcon} alt='facebook icon' height={22} width={22} /></span></a>
              <a href='https://www.instagram.com/bombshellinfluencers/'><span className="icon-wrapper"><Image className='icon' src={InstagramIcon} alt='instagram icon' height={22} width={22} /></span></a>
              <a href='https://twitter.com/bombshellinflu'><span className="icon-wrapper"><Image className='icon' src={TwitterIcon} alt='twitter icon' height={22} width={22} /></span></a>
              <a href='https://t.me/bombshellinfluencers'><span className="icon-wrapper"><Image className='icon' src={TelegramIcon} alt='telegram icon' height={22} width={22} /></span></a>
              <a href='https://www.snapchat.com/add/bombshellinflu'><span className="icon-wrapper"><Image className='icon' src={SnapchatIcon} alt='snapchat icon' height={22} width={22} /></span></a>
              <a href='https://www.tiktok.com/@bombshellinfluencers'><span className="icon-wrapper"><Image className='icon' src={TikTokIcon} alt='tiktok icon' height={22} width={22} /></span></a>
            </div>
          </div>
          <div className="links-container">
            <div className="service-wrapper">
              <h2 className='heading'>Customer Service</h2>
              <ul className="link-wrapper">
                <Link href={'/about-us'}><a><li className='link dot'>About Us</li></a></Link>
                <Link href={'/contact-us'}><a><li className='link dot'>Contact Us</li></a></Link>
                <Link href={'/explore'}><a><li className='link dot'>Explore Creators</li></a></Link>
                {/* <li className='link dot'>Explore Creators</li> */}
                <li className='link dot'>FAQ's</li>
              </ul>
            </div>
            <div className="legal-wrapper">
              <h2 className='heading'>Legal</h2>
              <ul className="link-wrapper">
                <Link href={'/dmca'}><a><li className='link dot'>DMCA</li></a></Link>
                <Link href={'/nsfw'}><a><li className='link dot'>NFSW</li></a></Link>
                <Link href={'/privacy-policy'}><a><li className='link dot'>Privacy</li></a></Link>
                <Link href={'/terms-and-conditions'}><a><li className='link dot'>Terms</li></a></Link>
                <Link href={'/usc2257'}><a><li className='link dot'>USC - 2257</li></a></Link>
              </ul>
            </div>
            <div className="join-wrapper">
              <h2 className='heading'>Join as</h2>
              <ul className="link-wrapper">
                <Link href={'/signup-as-creator'}><a><li className='link dot'>Creator</li></a></Link>
                <Link href={'/agency'}><a><li className='link dot'>Agency</li></a></Link>
                <Link href={'/signup-as-user'}><a><li className='link dot'>User</li></a></Link>
              </ul>
            </div>
            <div className="subscribe-wrapper">
              <h2 className='heading'>Subscribe To Our Newsletter</h2>
              <form onSubmit={(e) => postSubscribeMail(e)} className="form">
                <input
                  className='input'
                  placeholder='Enter email here'
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="pagebtn varient-1">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="copyright">
          <span>© {year} Bombshell Influencers LLC. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Image src={lockIcon} alt='lock icon' width={12} height={12} /> SSL Encrypted | <Image src={shieldLockIcon} alt='shield lock icon' width={12} height={12} /> DMCA Protected</span>
        </div>
      </footer>
      <style jsx>{`
        footer {
          background: var(--purple);
          color: var(--light-purple);
        }
        .input {
          color: var(--white);
          caret-color: var(--white);
        }
        .link.dot {
          display: flex;
          font-size: 18px;
          align-items: center;
          list-style: none;
          color:#A588AD;
        }
        a{
          text-decoration:none;
        }
       
        .dot::before {
          content: "";
          height: 5px;
          width: 5px;
          border-radius: 50%;
          margin-inline: 10px;
          background: var(--light-purple);
          display: inline-block;
        }
        .link-wrapper {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .footer {
          padding-block: 64px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1550px;
          margin-inline: auto;
        }
        .divider {
          border-top: 1px solid var(--transparent-border);
        }
        .copyright {
          max-width: 1550px;
          margin-inline: auto;
          padding-block: 30px 55px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: space-between;
        }
        .social-media {
          margin-top: 45px;
          display: flex;
          justify-content: center;
          padding: 12px 16px;
          gap: 1rem;
        }
        .icon-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D33AFF40 0%, #FF71A440 100%);
        }
        .links-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 80px;
        }
        .form {
          display: flex;
          flex-direction: column;
          max-width: 388px;
          gap: 24px;
        }
        .heading {
          max-width: 350px;
          font-size: 28px;
          color: var(--white);
          margin-bottom: 30px;
        }
        .pagebtn {
          width: max-content;
          padding: 18px 37px;
        }
        .logo-wrapper {
          margin-bottom: 20px;
          text-align:center;
        }

        @media screen and (max-width: 1690px) {
          .footer, .copyright {
            width: 90%;
          }
        }

        @media screen and (min-width: 1480px) {
          .logo-wrapper {
            margin-right: auto;
          }
        }
        
        @media screen and (max-width: 767px) {
          :global(.logo-wrapper > span:has(.footer-logo)), .subscribe-wrapper {
            display: none !important;
          }
          .links-container {
            gap: 28px;
          }
          .icon-wrapper {
            height: 24px;
            width: 24px;
          }
          :global(.icon) {
            height: 12px !important;
            width: 12px !important;
            min-width: auto !important;
            min-height: auto !important;
          }
          .heading {
            font-size: 16px;
            margin-bottom: 16px;
          }
          .link.dot {
            font-size: 12px;
          }
          .logo-wrapper {
            margin-bottom: 0;
          }
          .footer {
            padding-block: 40px;
            flex-direction: column-reverse;
            padding-bottom: 0;
          }
          .links-container {
            flex-direction: column;
          }
          .dot::before {
            display: none;
          }
          .link-wrapper {
            align-items: center;
            gap: 1rem;
          }
          .service-wrapper, .legal-wrapper, .join-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .social-media {
            gap: 8px;
            border-top: 1px dashed #3C2342;
            margin-top: 40px;
            padding-block: 24px;
          }
          .divider {
            border-top: 1px dashed #3C2342;
          }
          .service-wrapper {
            order: 1;
          }
          .join-wrapper {
            order: 2;
          }
          .legal-wrapper {
            order: 3;
          }
          .copyright {
            padding: 20px 18px;
            font-size: 10px;
          }
        }

      `}</style>
    </>
  )
}

export default Footer