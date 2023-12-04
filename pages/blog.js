import { agency02 } from '../public/Bombshell/images/agency';
import { blog01 } from '../public/Bombshell/images/blog';
import { asteriskIcon, sparkleIcon } from '../public/Bombshell/images/float-buttons'
import Image from 'next/image'
import React from 'react'
import Header from '../containers/Header'
import Footer from '../containers/Footer'

const Blog = ({ blogData }) => {
  console.log(blogData,"sadaii")
  return (
    <>
      <Header />
      <div className="wrapper">
        <div className="banner-wrapper">
          <div className="heading">
            <h1 className='title sm-none text-black'>Check out News, <span className='theme-color'>Updates and Posts </span>from our creators</h1>
            <p className='para'>Stay in the know and subscribe to our email list.</p>
            <div className="button-wrapper">
              <input className='input' type="email" placeholder='Enter email here' name="email" id="email" />
              <button className="pagebtn varient-1">Subscribe</button>
            </div>
          </div>
          <div className="float-icon"><Image src={sparkleIcon} alt='sparkle icon' height={128} width={128} /></div>
          <div className="float-icon"><Image src={asteriskIcon} alt='asterisk icon' height={135} width={135} /></div>
          <div className="image-wrapper">
            <Image src={blog01} alt='banner image' height={514} width={518} priority />
          </div>
          <h1 className='title md-none'>Check out News, <span className='theme-color'>Updates and Posts </span>from our creators</h1>
        </div>
        <div className="talent-wrapper">
          <h2 className='title-2 text-black'><span className='theme-color'>Recent</span> Blog Posts</h2>
          <div className="blog-section">
            <div className="grid-wrapper">
              {blogData?.map((card, index) => (
                <div className="card" key={index}>
                  <div className="image-wrapper">
                    <Image className='card-image' src={card?.imgSrc} alt={card?.alt} width={459} height={313} objectFit='cover' />
                  </div>
                  <div className="details">
                    <span className="title-3 bold text-black">{card?.title}</span>
                    <p className="card-para">{card?.description}</p>
                    <button className='btn-more bold'>Read More</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="pagebtn varient-1 btn-line">View more blogs</button>
          </div>
        </div>
        <div className="join-wrapper">
          <div className="detail-wrapper">
            <h2 className="title text-black">Join the <span className="theme-color">Bombshell Community</span></h2>
            <p className="description">By becoming part of the Bombshell community, agencies gain access to a supportive, like-minded environment that values creativity and growth, while offering their talent a seamless and empowering experience. Our cutting-edge platform equips agencies with powerful tools and features, enabling them to efficiently manage all their talent and employees in one centralized place. From robust analytics to a user-friendly Agency Dashboard, we provide the necessary resources for agencies to optimize their operations and elevate their earnings through automated commission payouts. Take your agency to new heights with Bombshell and revolutionize the way you manage and nurture your talent.</p>
            <button className="pagebtn varient-1">Start your journey today</button>
          </div>
          <div className="image-wrapper">
            <Image src={agency02} alt='banner image' width={492} height={487} />
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        :global(body) {
          background: var(--white) !important;
          color: var(--l_altertative_text_color) !important;
          font-family: Raleway !important;
        }
        .wrapper {
          background: var(--white);
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
        .bold {
          font-weight: bold;
        }
        .blog-section {
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
        :global(.card .image-wrapper > span){
          width: 100% !important;
          height: 100% !important;
        }
        .button-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
        }
        .input {
          min-width: 388px;
          color: var(--l_strong_app_text);
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
          gap: 22px;
        }
        .card {
          border: .5px solid #D7D7D7;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          padding: 16px;
          transition: all 300ms;
        }
        .card:hover {
          background: var(--hover-bg);
          border: 1px solid var(--hover-bg);
        }
        :global(.card-image) {
          border-radius: 12px;
        }
        .title-3 {
          font-size: clamp(12px, 3vw, 28px);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-para {
          color: var(--l_strong_app_text);
          font-size: clamp(10px, 3vw, 20px);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .btn-line {
          font-size: clamp(10px, 3vw, 1rem);
        }
        .banner-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          max-width: 1540px;
          margin: 80px auto;
        }
        .heading {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 24px;
          margin-right: auto;
        }
        .title {
          display: flex;
          flex-direction: column;
          font-size: clamp(30px, 5vw, 72px);
        }
        .btn-more {
          background: transparent;
          color: var(--l_strong_app_text);
          font-size: clamp(10px, 3vw, 20px);
          width: max-content;
        }
        .details {
          margin-top: 20px;
          display: grid;
          gap: 16px;
        }
        .sm-none {
          display: flex;
        }
        .md-none {
          display: none;
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
          height: max-content;
          max-width: 1420px;
          text-align: center;
          font-size: clamp(12px, 2vw, 24px);
          line-height: clamp(20px, 3vw, 40px);
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
            top: 20%;
          }
          .float-icon:nth-child(3) {
            right: 10vw;
            top: 45%;
          }
          .blog-section {
            flex-direction: column;
            gap: 14px;
          }
          .pagebtn.btn-line {
            background: transparent;
            color: var(--l_strong_app_text);
            text-decoration: underline;
          }
          .button-wrapper {
            gap: 12px;
            justify-content: center;
          }
          .sm-none {
            display: none;
          }
          .md-none {
            display: flex;
          }
          .input {
            padding: 10px 10px 10px 16px;
            min-width: auto;
            width: 100%;
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
            gap: 12px;
            max-width: 600px;
            margin: 0;
          }
          .card {
            border-radius: 8px;
            padding: 6px 6px 13px 6px;
          }
          .card .image-wrapper {
            max-width: 100%;
            max-height: 170px;
          }
          :global(.card-image) {
            border-radius: 6px;
          }
          .details {
            gap: 8px;
            margin-top: 8px;
          }
          .heading, .title {
            margin: 0;
            align-items: center;
            text-align: center;
          }
          .image-wrapper {
            max-height: 270px;
            max-width: 230px;
          }
          .description {
            margin-inline: 10px;
          }
          .banner-wrapper {
            margin-block: 48px;
            padding-inline: 10px;
            flex-direction: column-reverse;
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

Blog.getInitialProps = async () => {
  const { blogPost01, blogPost02, blogPost03, blogPost04, blogPost05, blogPost06 } = await import('../public/Bombshell/images/blog/index');
  const blogData = [
    {
      imgSrc: blogPost01,
      alt: "Image",
      title: "Lorem ipsum dolor sit amet, adipiscing elit.",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  lorem2vffdsxz",
    },
    {
      imgSrc: blogPost02,
      alt: "Image",
      title: "Lorem ipsum dolor sit amet, adipiscing elit.",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  lorem2vffdsxz",
    },
    {
      imgSrc: blogPost03,
      alt: "Image",
      title: "Lorem ipsum dolor sit amet, adipiscing elit.",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  lorem2vffdsxz",
    },
    {
      imgSrc: blogPost04,
      alt: "Image",
      title: "Lorem ipsum dolor sit amet, adipiscing elit.",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  lorem2vffdsxz",
    },
    {
      imgSrc: blogPost05,
      alt: "Image",
      title: "Lorem ipsum dolor sit amet, adipiscing elit.",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  lorem2vffdsxz",
    },
    {
      imgSrc: blogPost06,
      alt: "Image",
      title: "Lorem ipsum dolor sit amet, adipiscing elit.",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  lorem2vffdsxz",
    },
  ]

  return {
    // props: {
      blogData
    // }
  } 
}

export default Blog;