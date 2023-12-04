import Header from '../containers/Header'
import Footer from '../containers/Footer'
import { agency01,agency02} from '../public/Bombshell/images/agency';
import { asteriskIcon, sparkleIcon } from '../public/Bombshell/images/float-buttons'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link';
import Seo from '../components/Seo';
import useLang from '../hooks/language';

const Agency = ({ agencyData}) => {
  const [lang] = useLang()
  return (
    <>
      <Seo title={lang.seoAgencyTitle} description={lang.seoAgencyDesc} viewport={true} />
      <Header />
      <div className="banner-wrapper">
        <div className="heading">
          <h1 className='title text-black'>Unleash Your Agencies <span className='theme-color'>Full Potential</span></h1>
          <p className='para'>The first ever platform with built-in agency features to manage all of your talent and employees in one place</p>
          <div className="button-wrapper">
            <Link href={"/signup-as-a-agency"}><a><button className="pagebtn varient-1">Join as an Agency</button></a></Link>
          </div>
        </div>
        <div className="float-icon"><Image src={sparkleIcon} alt='sparkle icon' height={128} width={128} /></div>
        <div className="float-icon"><Image src={asteriskIcon} alt='asterisk icon' height={135} width={135} /></div>
        <div className="image-wrapper">
          <Image src={agency01} alt='banner image' height={571} width={478} priority />
        </div>
      </div>
      <div className="talent-wrapper">
        <h2 className='title-2 text-black'><span className='theme-color'>Empowering</span> Talent Management</h2>
        <p className="description">Bombshell Influencers offers a comprehensive suite of features tailored for agencies and creators, simplifying talent management and maximizing success. From seamless commission payouts to detailed analytics, Bombshell streamlines every aspect of your agency's operations, allowing you to focus on what matters most – nurturing and propelling your talent to greater heights</p>
        <div className="card-container">
          <div className="grid-wrapper">
            {agencyData?.map((card, index) => (
              <div className="card" key={index}>
                <div className="coin">
                  <Image className='icon' src={card?.imgSrc} alt={card?.alt} height={50} width={50} />
                </div>
                <div className="details">
                  <span className="title-3 text-black">{card?.title}</span>
                  <p className="card-para">{card?.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href={"/signup-as-a-agency"}><a><button className="pagebtn varient-1">Join as an Agency</button></a></Link>
        </div>
      </div>
      <div className="join-wrapper">
        <div className="detail-wrapper">
          <h2 className="title text-black">Join The <span className="theme-color">Bombshell Community</span></h2>
          <p className="description">By becoming part of the Bombshell community, agencies gain access to a supportive, like-minded environment that values creativity and growth, while offering their talent a seamless and empowering experience. Our cutting-edge platform equips agencies with powerful tools and features, enabling them to efficiently manage all their talent and employees in one centralized place. From robust analytics to a user-friendly Agency Dashboard, we provide the necessary resources for agencies to optimize their operations and elevate their earnings through automated commission payouts. Take your agency to new heights with Bombshell and revolutionize the way you manage and nurture your talent.</p>
          <Link href={"/signup-as-a-agency"}><button className="pagebtn varient-1">Start Your Journey Today</button></Link> 
        </div>
        <div className="image-wrapper">
          <Image src={agency02} alt='banner image' width={492} height={487} />
        </div>
      </div>
      <Footer />
      <style jsx>{`
       :global(body) {
        background: var(--white) !important;
        color: var(--l_altertative_text_color) !important;
        font-family: Raleway !important;
      }
        .float-icon {
          position: absolute;
          top: -10px;
          right: 45vw;
          max-width: clamp(50px, 10vw, 130px);
        }
        .float-icon:nth-child(3) {
          top: 85%;
          right: 3vw;
          filter: blur(2px);
        }
        .card-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 78px;
        }
        .join-wrapper {
          max-width: 1550px;
          margin: 110px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        
        }
        .join-wrapper .title {
          max-width: 800px;
          align-items: center;
        }
        .join-wrapper .image-wrapper {
          width: 30%;
        }
        .detail-wrapper {
          margin-right: auto;
          width: 60%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }
        .grid-wrapper {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-left: 40px;
          gap: 50px;
        }
        .card {
          position: relative;
          border: .5px solid #D7D7D7;
          border-radius: 12px;
          display: flex;
          padding: 24px 24px 46px 64px;
        }
        .coin {
          height: 80px;
          width: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #F7F7F7;
          border-radius: 50%;
          position: absolute;
          left: -40px;
          top: 50%;
          transform: translateY(-50%);
        }
        .title-3 {
          font-weight: bold;
          font-size: clamp(16px, 3vw, 30px);
        }
        .card-para {
          margin-top: 16px;
          color: var(--l_strong_app_text);
          font-size: clamp(12px, 3vw, 18px);
        }
        .banner-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          max-width: 1540px;
          margin: 80px auto;
        }
        .heading {
          max-width: 700px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 24px;
          max-width: 800px;
          margin-right: auto;
        }
        .title {
          display: flex;
          flex-direction: column;
          max-width: 500px;
          font-size: clamp(30px, 5vw, 72px);
        }
        .title-2 {
          font-size: clamp(30px, 5vw, 72px);
          text-align: center;
        }
        .para {
          line-height: clamp(20px, 3vw, 40px);
          color: var(--l_strong_app_text);
          font-size: clamp(12px, 2vw, 24px);
          margin-bottom: 40px;
        }
        .theme-color {
          color: var(--title-color);
        }
        .talent-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          max-width: 1550px;
          margin: 0 auto;
        }
        .description {
          color: var(--l_strong_app_text);
          max-width: 1420px;
          text-align: center;
          font-size: clamp(12px, 2vw, 24px);
          line-height: clamp(20px, 3vw, 40px);
          height:max-content;
        }
        .pagebtn {
          padding: 18px 58px;
          width: max-content;
        }

        @media screen and (max-width: 1670px) {
          .banner-wrapper, .talent-wrapper, .join-wrapper {
            width: 90%;
          }
        }

        @media screen and (max-width: 1200px) {
          .grid-wrapper {
            grid-template-columns: repeat(2, 1fr);
            max-width: 950px;
          }
        }
        
        @media screen and (max-width: 800px) {
          .float-icon {
            right: 80vw;
          }
          .float-icon:nth-child(3) {
            right: 10vw;
            top: 45%;
          }
          .card-container {
            flex-direction: column-reverse;
            gap: 40px;
          }
          .join-wrapper {
            flex-direction: column-reverse;
            margin-block: 40px;
            margin-inline: 25px;
            gap: 40px;
            align-items: center;
          }
          .join-wrapper .image-wrapper {
            max-width: 265px;
            width: 100%;
            max-height: 265px;
          }
          .detail-wrapper {
            margin: 0;
            gap: 16px;
            width: 100%;
          }
          .grid-wrapper {
            grid-template-columns: 1fr;
            max-width: 600px;
            margin: 0;
          }
          .coin {
            left: 50%;
            transform: translate(-50%, -50%);
            top: 0px;
            height: 48px;
            width: 48px;
          }
          .card {
            padding: 30px 15px 20px;
          }
          .details {
            text-align: center;
          }
          :global(.icon) {
            height: 30px !important;
            width: 30px !important;
            min-width: auto !important;
          }
          .heading, .title {
            align-items: center;
            text-align: center;
          }
          .image-wrapper {
            max-height: 290px;
            max-width: 260px;
          }
          .description {
            margin-inline: 10px;
          }
          .banner-wrapper {
            margin-block: 48px;
            padding-inline: 40px;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .para {
            text-align: center;
            margin: 0;
          }
          .pagebtn {
            padding: 8px 30px;
          }
        }
      
      `}</style>
    </>
  )
}

 
Agency.getInitialProps=async()=> {
  const { discountIcon, dollarIcon, hashIcon, presentionIcon, peopleIcon, favoriteIcon } = await import('../public/Bombshell/images/agency/index');
  const agencyData = [
    {
      imgSrc: discountIcon,
      alt: 'discount icon',
      title: 'Simplify Commissions',
      description: "Unlock your agency's full potential and amplify earnings with seamless, automated commission payouts",
    },
    {
      imgSrc: dollarIcon,
      alt: 'discount icon',
      title: 'Monetization Mastery',
      description: "Unleash your agency's monetization potential with our innovative solutions",
    },
    {
      imgSrc: hashIcon,
      alt: 'discount icon',
      title: 'Streamlined Management',
      description: "Elevate your agency's efficiency with our streamlined management suite, empowering your operations",
    },
    {
      imgSrc: presentionIcon,
      alt: 'discount icon',
      title: 'Agency Dashboard',
      description: "Optimize creator management with our powerful, user-friendly Agency Dashboard",
    },
    {
      imgSrc: peopleIcon,
      alt: 'discount icon',
      title: 'Employee Onboarding',
      description: "Experience the ease of seamless employee onboarding and management with Bombshell",
    },
    {
      imgSrc: favoriteIcon,
      alt: 'discount icon',
      title: 'Powerful Analytics',
      description: "Unlock the full potential of your agency with Bombshell's powerful and cutting edge analytics",
    },
  ];
  
 

  return {
      agencyData
  }
}

export default Agency