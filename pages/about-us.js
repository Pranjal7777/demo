import Header from '../containers/Header'
import Footer from '../containers/Footer'
import { aboutUs01 } from '../public/Bombshell/images/aboutPage'
import { asteriskIcon, sparkleIcon } from '../public/Bombshell/images/float-buttons'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import useLang  from '../hooks/language'
import Link from 'next/link'
import Seo from '../components/Seo'

const About = ({ aboutData }) => {
  const [lang]=useLang()
  return (
    <>
      <Seo title={lang.seoAboutUsTitle} description={lang.seoAboutUsDesc} viewport={true} />
      <Header />
      <div className="banner-wrapper">
        <div className="heading">
          <h1 className='title sm-none text-black'>{lang.aboutUs}</h1>
          <p className='para'>{lang.aboutUsDescription}</p>
          {/* <div className="button-wrapper">
            <Link href={"/agencyLogin"}><a><button className="pagebtn varient-1">{lang.joinAgencybutton}</button></a></Link>
            <Link href={"/signup-as-creator"}><a><button className="pagebtn varient-2" data="Become a Creator"></button></a></Link>
          </div> */}
        </div>
        <div className="float-icon"><Image src={sparkleIcon} alt='sparkle icon' height={128} width={128} /></div>
        <div className="float-icon"><Image src={asteriskIcon} alt='asterisk icon' height={135} width={135} /></div>
        <div className="image-wrapper">
          <Image src={aboutUs01} alt='banner image' height={527} width={530} priority />
        </div>
        <h1 className="title md-none">{lang.aboutUs}</h1>
      </div>
      <div className="welcome-wrapper">
        <h2 className='title text-center text-black'>{lang.welcomeTo} <span className="theme-color">{lang.bombshellInfluencers}</span></h2>
        {aboutData.map((card, index) => (
          <div className="card" key={index}>
            <div className="card-img-wrapper">
              <Image objectFit='cover' src={card?.imgSrc} alt={card?.alt} height={card?.height} width={card?.width} />
            </div>
            <p className="card-detail">{card?.description}</p>
          </div>
        ))}
      </div>
      <div className="mission-wrapper">
        <h2 className='title-2 text-center text-black'><span className='theme-color'>Our</span> Mission</h2>
        <div className="details">
          <p className='detail'>At Bombshell Influencers, our mission is to revolutionize the digital content landscape by empowering creators and agencies to seize control of their brands and unlock their true earning potential.</p>
          <p className='detail'>We provide a premier social subscription platform that fosters creativity, independence, and financial success, while fostering a supportive and inclusive community. Together, we strive to shape the future of content monetization, making it more rewarding and fulfilling for all involved</p>
        </div>
        <Link href={"/signup-as-user"}><a><button className="pagebtn varient-1 join">Join Now</button></a></Link>
      </div>
      <Footer />
      <style jsx>{`
       :global(body) {
        background: var(--white) !important;
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
          right: 5vw;
          filter: blur(2px);
        }
        .banner-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          max-width: 1540px;
          margin: 80px auto;
        }
        .welcome-wrapper {
          max-width: 1540px;
          margin: 0 auto;
          display: grid;
          gap: 40px;
        }
        .mission-wrapper {
          max-width: 1540px;
          margin: 80px auto;
          display:grid;
          gap: 40px;
          background: linear-gradient(135deg, rgba(211, 58, 255, 0.25) 0%, rgba(255, 113, 164, 0.25) 100%);
          padding: 32px 24px;
          border-radius: 12px; 
        }
        .mission-wrapper a{
          margin:auto;
        }
        .card {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 100px;
          border: none;
        }
        .card:nth-child(2n-1) {
          flex-direction: row-reverse;
        }
        .card-img-wrapper {
          width: 30%;
        }
        .card-detail {
          color: var(--l_strong_app_text);
          width: 70%;
          line-height: clamp(20px, 3vw, 40px);
          max-width: 1024px;
          font-size: clamp(12px, 2vw, 24px);
        }
        .details {
          display: grid;
          gap: 30px;
          max-width: 1395px;
        }
        .detail {
          color: var(--l_strong_app_text);
          text-align: center;
          font-size: clamp(12px, 2vw, 24px);
          line-height: clamp(20px, 3vw, 40px);
        }
        .sm-none {
          display: block;
        }
        .md-none {
          display: none;
        }
        .heading {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 24px;
          max-width: 800px;
          margin-right: auto;
        }
        .title {
          font-size: clamp(30px, 5vw, 72px);
        }
        .title-2 {
          font-size: clamp(24px, 5vw, 72px);
        }
        .theme-color {
          color: var(--title-color);
        }
        .para {
          line-height: clamp(20px, 3vw, 40px);
          color: var(--l_strong_app_text);
          font-size: clamp(12px, 2vw, 24px);
          margin-bottom: 40px;
        }
        .button-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .pagebtn {
          padding: 18px 58px;
        }
        .join {
          width: max-content;
          margin: 0 auto;
          padding: 18px 80px;
        }

        @media screen and (max-width: 1670px) {
          .banner-wrapper, .welcome-wrapper, .mission-wrapper {
            width: 90%;
          }
        }

        @media screen and (max-width: 800px) {
          .pagebtn {
            padding: 12px 30px;
          }
          .sm-none {
            display: none;
          }
          .md-none {
            display: block;
          }
          .float-icon {
            right: 70vw;
          }
          .float-icon:nth-child(3) {
            right: 10vw;
            top: 45%;
          }
          .title:has(.theme-color) {
            display: flex;
            flex-direction: column;
          }
          .para {
            text-align: center;
            margin: 0;
          }
          .welcome-wrapper {
            padding-inline: 25px;
            gap: 20px;
          }
          .mission-wrapper {
            gap: 20px;
            margin-block: 40px;
            padding: 24px 22px;
          }
          .image-wrapper {
            max-height: 280px;
            max-width: 248px;
          }
          .banner-wrapper {
            margin-block: 48px;
            padding-inline: 40px;
            flex-direction: column-reverse;
            align-items: center;
            gap: 20px;
          }
          .button-wrapper {
            gap: 16px;
            justify-content: center;
          }
          .welcome-wrapper .card {
            flex-direction: column-reverse;
            gap: 20px;
          }
          .card-img-wrapper {
            width: 100%;
            max-width: 200px;
            max-height: 200px;
          }
          .card-detail {
            width: 100%;
            text-align: center;
            padding-inline: 10px;
          }
          .detail {
            gap: 15px;
          }
        }

      `}</style>
    </>
  )
}

About.getInitialProps =async()=> {
  const { bombIcon,aboutCard01,aboutCard02,aboutCard03 } = await import('../public/Bombshell/images/aboutPage/index');
  const aboutData = [
    {
      imgSrc: bombIcon,
      alt: 'bomb icon',
      height: 424,
      width: 404,
      description: 'Welcome to Bombshell Influencers, where creator success is our driving force. Founded in 2021 by the visionary social media mogul, Carrie LaChance, our platform was born from the desire to empower content creators to embrace their unique brands fully. Tired of the limitations imposed by other platforms, Carrie sought to create the Rolls Royce of subscription platforms, allowing creators to easily advertise and monetize their own brand, taking control of their destiny.',
    },
    {
      imgSrc: aboutCard01,
      alt: 'Image',
      height: 415,
      width: 416,
      description: 'At Bombshell Influencers, we have a dedicated team with over 30 years of experience in website, technology, and app development. With our expertise, we have crafted a clean, reliable, and highly monetizable platform that enables creators to have complete ownership over their content and earnings. We firmly believe in putting the power back where it belongs - in the hands of the creators.',
    },
    {
      imgSrc: aboutCard02,
      alt: 'Image',
      height: 415,
      width: 416,
      description: "Gone are the days of relying on someone else's platform and conforming to their rules. With Bombshell Influencers, creators can build their own foundation, catered to their unique vision and audience. We offer the tools and support needed to navigate the digital landscape successfully, allowing creators to focus on what they do best - creating remarkable content.",
    },
    {
      imgSrc: aboutCard03,
      alt: 'Image',
      height: 415,
      width: 416,
      description: "Join Bombshell Influencers today and experience the ultimate platform for content creators. Empower yourself with the freedom to monetize your brand on your terms, while our team stands firmly beside you, ensuring you have everything you need to flourish in the digital realm. Your journey to success starts here, with Bombshell Influencers - where it's all about you.",
    },
  ];
  
  //console.log(aboutData);
  return {
      aboutData
  }
}

export default About