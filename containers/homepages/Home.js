import React from 'react'
import Image from 'next/image'
import useLang from "../../hooks/language";
import { blog1, blog2, blog3, chats, comib_mob, comma, groupmobile, iPhone1, iPhone2, iPhone3, img1, img10, img11, img12, img2, img3, img4, img5, img6, img7, img8, img9, left, mobile_chat, right, storiesmobile, str, } from '../../public/Bombshell/images/home';
import Carousel, { consts } from 'react-elastic-carousel';
import Header from '../../containers/Header';
import Footer from '../../containers/Footer';
import Link from 'next/link';
import { newsletter } from '../../services/auth';
import { Toast } from '../../lib/global/loader';
import { handleContextMenu } from '../../lib/helper';

function HomePage({ testimonial }) {
  const [lang] = useLang();
  const [email, setEmail] = React.useState("");

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 426, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 2, itemsToScroll: 2 },
    { width: 1024, itemsToShow: 3, itemsToScroll: 3 },

  ]

  const myArrow = ({ type, onClick, isEdge }) => {
    const pointer = type === consts.PREV ? <Image className='aicon' src={left} width={24} height={24} alt='arrow-icon' /> : <Image src={right} width={24} height={24} className='aicon' alt='arrow-icon' />
    return (
      <button className='crousal_btn' onClick={onClick} disabled={isEdge}>
        {pointer}
      </button>
    )
  }

  const postSubscribeMail = async (e) => {
    e.preventDefault();
    let payload = {
      email: email,
    }
    try {
      const res = await newsletter(payload);
      if (res.status === 200) {
        setEmail("");
        Toast("Thank you for applying to Subscribe", "success")
      }
    } catch (error) {
      console.log(error);
      setEmail("");
      Toast(error?.message, "error")
    }
  }

  return (
    <>
      <Header />

      <div className='create'>
        <div>
          <h1 className='c_text text-black'> {lang.create}</h1>
          <h1 className='c_connect text-black'>{lang.connect}<span className='earn'> {lang.andEarn}</span></h1>
          <p className='exp'>{lang.connectDescription}</p>
          <div className="become_btn"><Link href={"/signup-as-creator"}><a><button className="pagebtn varient-1">{lang.creatorButton}</button></a></Link></div>
        </div>
        <div className='mobile_img'>
          <img src={comib_mob} alt='banner' className='callout-none' onContextMenu={handleContextMenu} />
        </div>
      </div>
      <div className='section_two'>
        <p className='expo_creator text-black'>{lang.exploreCreator}</p>
        <div className='grid callout-none' onContextMenu={handleContextMenu}>
          <img src={img1} alt='img1' />
          <img src={img2} alt='img2' />
          <img src={img3} alt='img3' />
          <img src={img4} alt='img4' />
          <img src={img5} alt='img5' />
          <img src={img6} alt='img6' />
          <img src={img7} alt='img7' />
          <img src={img8} alt='img8' />
          <img src={img9} alt='img9' />
          <img src={img10} alt='img10' />
          <img src={img11} alt='img11' />
          <img src={img12} alt='img12' />
        </div>
        <div className='all'><Link href={"/explore"}><a className="pagebtn varient-1">{lang.exploreAll}</a></Link></div>
      </div>
      <div className='section_three'>
        <p className='light_div text-black'>{lang.lightsTitle}</p>
        <div className='camera_img callout-none' onContextMenu={handleContextMenu}>
          <img className='camera_img1' src={iPhone3} alt='i1' />
          <img className='camera_img2' src={iPhone1} alt='i2' />
          <img className='camera_img3' src={iPhone2} alt='i3' />
        </div>
        <div className='waiting'><p>{lang.waitingFor}</p></div>
        <div className='join_btn'><Link href={"/signup-as-user"}><a><button className="pagebtn varient-1">{lang.joinButton}</button></a></Link></div>
      </div>

      <div className='four_mobile callout-none' onContextMenu={handleContextMenu}>
        <div>
          <div className='four_img'><img src={groupmobile} alt='lorem1' /></div>
          <div className='four_img2'><img src={storiesmobile} alt='lorem2' /></div>
        </div>
        <div>
          <p className='stories text-black' >{lang.storiesTitle}</p>
          <p className='post'>{lang.postDescription}</p>
          <div className='join_btn1'><Link href={"/signup-as-user"}><a><button className="pagebtn varient-1">{lang.joinButton}</button></a></Link></div>
        </div>
      </div>

      <div className='chat_creator'>
        <div>
          <p className='p_chat text-black'>{lang.chatTitle}</p>
          <p className='engage_chat'>{lang.engageDescription}</p>
          <div className='join_btn2'><Link href={"/signup-as-user"}><a><button className="pagebtn varient-1">{lang.joinButton}</button></a></Link></div>
        </div>
        <div className='callout-none' onContextMenu={handleContextMenu}>
          <div className='chat_creator1'><img src={chats} alt='chats' /></div>
          <div className='chat_creator2'><img className='hard' src={mobile_chat} alt='chat1' /></div>
        </div>
      </div>

      <div className='live_streaming'>
        <p className='live_title text-black'>{lang.liveStreaming}</p>
        <p className='para'>{lang.liveDescription}</p>
        <p className='para1'>{lang.liveDescriptionmobile}</p>

        <img className='live_image callout-none' onContextMenu={handleContextMenu} src={str} alt='live' />
        <div className='join_btn4'><Link href={"/signup-as-user"}><a><button className="pagebtn varient-1">{lang.joinButton}</button></a></Link></div>
      </div>

      {/* <div className='b_news text-black'><p>{lang.bombshellTitle}</p></div> */}
      {/* <div className='news_blogs'>
        <div className='blog_sub_box'>
          <img src={blog1} alt='lorem1' />
          <p className='title text-black'>{lang.loremTitle}</p>
          <p className='desc'>{lang.loremDescription}</p>
          <p className='read_more'>{lang.readMore}</p>
        </div>
        <div className='blog_sub_box'>
          <img src={blog2} alt='lorem2' />
          <p className='title text-black'>{lang.loremTitle}</p>
          <p className='desc'>{lang.loremDescription}</p>
          <p className='read_more'>{lang.readMore}</p>
        </div>
        <div className='blog_sub_box'>
          <img src={blog3} alt='lorem3' />
          <p className='title text-black'>{lang.loremTitle}</p>
          <p className='desc'>{lang.loremDescription}</p>
          <p className='read_more'>{lang.readMore}</p></div>
      </div> */}

      {/* <div className='all'><button className="pagebtn varient-1">{lang.readMore}</button></div> */}

      {/* 
      what people section------------------------------------------------ */}

      <div className='what'>
        <p className='what_people_div text-black'>{lang.whatPeopleTitle}</p>
        <div className='comma callout-none'onContextMenu={handleContextMenu}><Image src={comma} width={195} height={195} alt='comma' /></div>
      </div>
      <div className='cont callout-none' onContextMenu={handleContextMenu}>
        <Carousel breakPoints={breakPoints} renderArrow={myArrow} >
          {
            testimonial.map((el, i) => (
              <div className='main' key={i}>
                <div className='lorem_p'><p >{el.desc}</p></div>
                <div className='profile_detail'>
                  <div className='profile'>
                    <Image src={el.profile_image} width={72} height={72} alt='profile icon' />
                  </div>
                  <div>
                    <p className='name text-black'>{el.profile}</p>
                    <p className='email text-black'>{el.profile_email}</p>
                    <div className='stars callout-none' onContextMenu={handleContextMenu}>
                      <img src={el.star} alt='star' className='star_icon' />
                      <img src={el.star} alt='star' className='star_icon' />
                      <img src={el.star} alt='star' className='star_icon' />
                      <img src={el.star} alt='star' className='star_icon' />
                      <img src={el.star} alt='star' className='star_icon' />
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </Carousel>

      </div>

      <form onSubmit={(e) => postSubscribeMail(e)} className='subscribe_box'>
        <p className='subscribe text-black'>Subscribe to our newsletter for updates</p>
        <input
          placeholder='Enter email here'
          className={`emailh input`}
          value={email}
          type='email'
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className='all'><button className="pagebtn varient-1">Subscribe</button></div>

      </form>
      <Footer />
      <style jsx>{`
         :global(body) {
          background: var(--white) !important;
          color: var(--l_altertative_text_color) !important;
          font-family: Raleway !important;
        }
        .create {
          width: 90%;
          margin: 60px auto;
          display: flex;
          align-items: center;
          gap: 10px; 
      }
      .stars {
          display: flex;
          gap: 2px;
          width: 80%;
      }
      .create>div {
          width: 50%;  
      }
      .c_text {
          font-size: 72px;
          font-weight: 700;   
      }
      .c_connect {
          font-size: 72px;
          font-weight: 700;
          margin-top: -20px;  
      }
      .exp {
          margin-top: 20px;
          color: var(--secondary, #5F596B);
          font-size: 20px;
          font-weight: 400;
      }
      
      .earn {
          background: var(--new-colour-gradient, linear-gradient(135deg, #D33AFF 0%, #FF71A4 100%));
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 72px;
          font-weight: 700;
      }
      .mobile_img{
        display:flex;
        align-item:center;
        justify-content:center;
      }
      .mobile_img>img{
        max-width:560px;
      }
      .section_two {
          text-align: center;
          align-items: center;
          margin-top:100px;
      }
      .expo_creator {
          font-size: 72px;
          font-weight: 700; 
      }
      
      .grid {
          /* border: 1px solid red; */
          height: 1098px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          margin-top: 64px;
          width: 100%;
      }
      
      .grid img {
          width: 100%;
          height: 350px;
          object-fit: cover;
          margin-top: 15px auto;
          border-radius: 10px;
      }
      
      .grid img:nth-child(2) {
          grid-column: span 2;
      }
      
      .grid img:nth-child(7) {
          grid-column: span 2;
      }
      
      .grid img:nth-child(10) {
          grid-column: span 2;
      }
      
      .section_three {
          text-align: center;
          align-items: center;
          margin-top: 100px;
      }
      
      .light_div {
          font-size: 72px;
          font-weight: 700;
          margin-top: 50px;    
      }
      
      .camera_img {
          display: flex;
          /* border: 3px solid green; */
          gap: 5px;
          max-height: 837px;
          align-items: center;
          justify-content: center;
          width: 60%;
          margin: 50px auto;
      }
      .camera_img1 {
          width: 31%;
          max-width:300px;
      }
      
      .camera_img2 {
          width: 44%;
          max-width:400px;
      }
      
      .camera_img3 {
          width: 31%;
          max-width:300px;
      }
      
      .waiting {
          width: 24%;
          margin: auto;
          color: var(--secondary, #5F596B);
          text-align: center;
          font-size: 24px;
          font-weight: 400;
      }
      
      .b_news {
          width: 65%;
          text-align: center;
          margin: auto;
          font-size: 72px;
          font-weight: 700;
          margin-top: 50px;
      }
      
      .news_blogs {
          padding-top: 40px;
          display: flex;
          flex-direction: row;
          gap: 25px;
          width: 85%;
          margin: auto;
      }
      
      .blog_sub_box {
          border: 1px solid #D7D7D7;
          padding: 10px;
          border-radius: 20px;
      }
      .blog_sub_box img{
        width:100%;
      }
      
      .blog_sub_box:hover {
          background: #FFCFE0;
          border:1px solid #FFCFE0;
      }
      
      .title {
          color: var(--l_altertative_text_color);
          font-size: 28px;
          font-weight: 700;
          padding: 10px 0px;
          margin-bottom:0px;
      }
      
      .desc {
          color: var(--secondary, #5F596B);
          font-size: 20px;
          font-weight: 400;
         margin-bottom:0px;
      }
      
      .read_more {
          font-size: 20px;
          color: var(--secondary, #5F596B);
          font-weight: 700;
          padding-top: 10px;
      }
      
      .four_mobile {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 60px;
          margin: 100px auto;
          width: 90%; 
      }
  
      .four_mobile>div:nth-child(2) {
          text-align: center; 
      }
      .four_img img{
        max-width:600px;
      }
      
      .stories {
          color: var(--l_altertative_text_color);
          font-size: 60px;
          font-weight: 700;
      }
      
      .post {
          color: var(--secondary, #5F596B);
          font-size: 20px;
          font-weight: 400;
          text-align: center;
      }
      
      .live_streaming {
          margin:100px auto;
          text-align: center;
      }
      
      .live_title {
          font-size: 72px;
          font-weight: 700;
          color: var(--l_altertative_text_color);
      }
      .live_image{
        width:100%;
      }
      
      .para {
          color: var(--secondary, #5F596B);
          text-align: center;
          width: 70%;
          font-size: 28px;
          font-weight: 400;
          margin: 15px auto;
      }
      
      .para1 {
          display: none;
      }
      
      .chat_creator {
          display: flex;
          width: 90%;
          gap: 20px;
          margin: 10px auto;
          align-items: center;
          justify-content:center;
      }
      
      .chat_creator div:nth-child(1) {
          text-align: center;
      }

      :global(.chat_creator2){
        display:none !important;
      }
      .chat_creator1 img{
        max-width:600px;
      }
      
      .p_chat {
          color: var(--l_altertative_text_color);
          font-size: 64px;
          font-weight: 700;
          padding: 10px 0px;
      }
      
      .engage_chat {
          color: var(--secondary, #5F596B);
          font-size: 24px;
          font-weight: 400;
      }
      
      .what {
          display: flex;
          width: 95%;
          justify-content: space-between;
          text-align: center;
          align-items: center;
          margin: auto;
          margin-top: 80px;
      }
      
      .what_people_div {
          color: var(--l_altertative_text_color);
          font-size: 72px;
          font-weight: 700;
      }
      
      .subscribe_box {
          display: none;
      }
      :global(.crousal_btn){
        height:48px;
        background:#ECECEC;
        min-width:48px;
        border-radius:50%;
        margin-block:auto;
      }
     :global(.rec.rec-dot){
        background-color:#ECECEC !important;
        box-shadow:none !important;
    }

     :global(.rec.rec-dot_active){
      background: var(--new-colour-gradient, linear-gradient(135deg, #D33AFF 0%, #FF71A4 100%)) !important;
    }
    :global(.rec.rec-pagination){
      position:static;
    }

    .become_btn button{
      padding:20px 55px 20px 55px;
    }
    .pagebtn{
        margin-top:40px;
    }
    .all{
      display: flex;
      align-items: center;
      justify-content: center;   
    }
    .join_btn{
      display: flex;
      align-items: center;
      justify-content: center; 
    }
    .join_btn4{
      display: flex;
      align-items: center;
      justify-content: center; 
    }
    :global(.four_img2){
      display:none !important; 
    }

    .cont{
        width:95%;
        margin:40px auto;
        position:relative;
    }

    .main{
       margin:0px 10px;
     }
          
    .lorem_p{
      font-size:20px;
      background: var(--gradient);
      border-radius: 20px 40px;
      padding:20px;
      color:white;
    }

    .profile_detail{
      display:flex;
      justify-content: flex-end;
      gap:10px;
      align-items: center;
      margin-top:10px;             
    }
    .name{
      font-size:24px;
      font-weight:700;
      margin-bottom:0px !important;
    }
    .email{
      font-size:18px;
      font-weight:400;
      margin-bottom:0px !important; 
    }

  @media screen  (max-width:427px) {
    .create {
      width: 90%;
      margin:48px auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .create>div {
      width: 100%;
  }
  .c_text {
      margin-top: 0px;
      font-size: 28px;
  }

  .c_connect {
      font-size: 28px;
      margin-top: -10px;
  }

  .earn {
      font-size: 28px;
  }

  .exp {
      font-size: 12px;
      margin-top: 10px;
  }
 
  .mobile_img img{
    margin-top:20px;
    max-width:280px;
   }
  .section_two{
      margin-top:0px;
  }

  .expo_creator {
      font-size: 28px;
  }

  .grid {
      height: 303px;
      gap: 5px;
      margin-top: 30px;
  }

  .grid img {
      width: 100%;
      height: 101px;
      border-radius: 5px;
  }
  .section_three{
      margin-top:0px;
  }

  .light_div {
      font-size: 28px;
  }

  .camera_img {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      width: 80%;
  }

  .camera_img1 {
      width: 31%;
      max-width:100px;
  }

  .camera_img2 {
      width: 44%;
      max-width:200px;
  }

  .camera_img3 {
      width: 31%;
      max-width:100px;
  }

  .waiting {
      margin: 20px auto;
      width: 80%;
      color: var(--secondary, #5F596B);
      font-size: 12px;
  }

  .b_news {
      width: 50%;
      margin: auto;
      font-size: 28px;
  }

  .news_blogs {
      display: grid;
      flex-direction: column;
      gap: 25px;
      width: 85%;
      margin: -10px auto;
  }

  .title {
      font-size: 12px;
  }

  .read_more {
      font-size: 10px;
  }

  .desc {
      margin-top: -10px;
      font-size: 10px;
      line-height: 20px;
  }

  .four_mobile {
      display: flex;
      flex-direction: row-reverse;
      gap: 0px;
      margin: 80px auto;
  }
  
  .four_mobile>div:nth-child(2) {
      text-align: left;
  }
  :global(.four_img){
    display:none !important;
  }

:global(.four_img2){
  display:block !important;
}
.four_img2 img{
  max-width:154px;
}
 
  .stories {
      font-size: 28px;
  }

  .post {
      font-size: 10px;
      text-align: justify;
      margin-top: 10px;
      line-height: 20px;
  }

  .live_streaming {
      margin: 80px auto;
  }

  .live_title {
      font-size: 28px;
  }

  .para {
      display: none;

  }

  .para1 {
      display: block;
      margin: 10px auto;
      font-size: 10px;
      font-weight: 400;
      line-height: 20px;
  }

  .chat_creator {
      width: 90%;
      margin-top: 15px;
  }

  .chat_creator div:nth-child(1) {
      padding-left: 0px;
      text-align: left;
  }

  .p_chat {
      font-size: 28px;
  }

  .engage_chat {
      font-size: 10px;
      line-height: 20px;
  }

  .what {
      padding: 0px 0px;
      margin: 0px;
      width: 100%;
  }

  .what_people_div {
      font-size: 24px;
      margin: 40px auto;
  }
  .star_icon{
    height: 4px !important;
      width: 4px !important;
  }
 

  // .stars>span {
  //     height: 4px !important;
  //     width: 4px !important;
  // }

  .subscribe_box {
      display: block;
      margin-top: 20px;
      text-align: center;
  }

  .subscribe {
      width: 45%;
      margin: auto;
      color: var(--l_altertative_text_color);
      font-size: 16px;
      font-weight: 700;
  }

  .emailh {
      width: 80%;
      align-items: center;
      display: flex;
      margin: 20px auto;
      justify-content: center;
      padding: 8px 10px 8px 10px;
  }

  .emailh input {
      border-radius: 20px;
      border: 0.5px solid #D7D7D7
  }

  .emailh input::placeholder {
      color: var(--secondary, #5F596B);
      font-size: 10px;
      
  }
    :global(.crousal_btn){
      height:20px;
      min-width:20px;
      border-radius:50%; 
    }

    :global(.aicon){
      height:10px !important;
      width:10px !important;
      min-height:10px !important;
      min-width:10px !important;
    }
  

    .become_btn button{
      padding:10px 30px 10px 30px;
      margin-top:-0px;
    }

    .pagebtn{
      margin-top:20px;
      padding:10px 55px 10px 55px;
    }

    .all{
        margin:20px auto;
        width:80%;             
      }
    .join_btn{
      margin:-20px auto;
      width:80%;             
      }
    
    :global(.chat_creator1){
      display:none !important;
    }

    :global(.chat_creator2){
      display:block !important;
      
    }
    .chat_creator2 img{
      max-width:120px;
    }

    :global(.profile){
      width:28px !important;
    }
      :global(.vectors){
        height:90px !important;
    } 
    .cont{
      width:90%;
      margin:auto; 
    }
  .main{
    margin-right:0px;
    width:80%;
    }
    
    .lorem_p{
      font-size:10px;
      background: var(--gradient);
      border-radius: 20px 40px;
      padding:20px;
      line-height:20px; 
    }

    .profile_detail{
      display:flex;
      justify-content: flex-end;
      gap:10px;
      align-items: center;
      margin-top:10px;       
    }
    .name{
        font-size:10px;       
    }
    .email{
        font-size:6px;
    }
    :global(.comma){
      display:none !important;
  }
} 

  @media screen (min-width:428px) and (max-width:768px){
    .create {
      width: 90%;
      display: grid;
      margin: 0px auto;
  }

  .create>div {
      width: 100%;
  }
 
  .c_text {
      margin-top: 50px;
      font-size: 36px;
  }

  .c_connect {
      font-size: 36px;
      margin-top:-5px;;
  }

  .earn {
      font-size: 36px;
  }
  .section_two{
      margin-top:60px;
  }

  .exp {
      font-size: 16px;
  }

  .mobile_img {
    margin-top: 20px;
    max-height: 398px;
    
}
.mobile_img>img{
  max-width:300px;
  
}

  .grid {
      margin-top: 29px;
      height: 303px;
      gap: 5px;
  }

  .grid img {
      height: 101px;
      object-fit: cover;
  }

  .expo_creator {
      font-size: 36px;
      margin-top: 29px;
  }
  .section_three{
      margin-top:0px;
  }

  .light_div {
      font-size: 36px;
      padding: 15px;
  }

  .camera_img {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      width: 90%;
  }

  .camera_img1 {
      width: 30%;
  }

  .camera_img2 {
      width: 40%;
  }

  .camera_img3 {
      width: 30%;
  }

  .waiting {
      margin: 20px auto;
      width: 90%;
      color: var(--secondary, #5F596B);
      font-size: 16px;
  }

  .b_news {
      width: 100%;
      margin: auto;
      font-size: 28px;
      margin-top:80px;  
  }

  .news_blogs {
      display: grid;
      flex-direction: column;
      gap: 25px;
      width: 65%;
      margin: auto;
  }

  .title {
      font-size: 12px;
  }

  .desc,
  .read_more {
      font-size: 10px;
  }

  .live_streaming {
      margin: 50px auto;
  }

  .live_title {
      font-size: 28px;
  }

  .para {
      font-size: 10px;
  }

  .four_mobile {
      display: flex;
      flex-direction: row-reverse;
      width: 90%;
      gap:40px;
      margin: 80px auto;
  }

  .four_mobile >div:nth-child(2) {
      text-align: center;
     
  }
  :global(.four_img){
    display:none !important;
    
  }
  .four_img2{
    display:block !important;
  }
  .four_img2 img{
    max-width:174px;
  }

  .stories {
      font-size: 28px;
  }

  .post {
      font-size: 10px;
      margin-top: 10px;
  }

  .chat_creator {
      width: 90%;
      display:flex;
      gap: 10px;
      text-align: center;
  }
  
  .chat_creator div:nth-child(1) {
      padding-left: 0px;
  }
  .chat_creator>div{
    width:50%;
   // border:2px solid pink;
}
  .chat_creator1{
    display:none;
  }

  :global(.chat_creator2){
    display:block !important;
  }
  .chat_creator2 img{
    width:100%;
  }

  .p_chat {
      font-size: 28px;
      text-align: center;
  }

  .engage_chat {
      font-size: 10px;
      text-align: center;    
  }

  .what {
      padding: 0px 0px;
      margin: 0px;
      width: 45%;
      margin:50px auto;
  }

  .what_people_div {
      font-size: 28px;
  }

  .star_icon{
    height: 4px !important;
      width: 4px !important;
  }

  // .stars>span {
  //     height: 4px !important;
  //     width: 4px !important;
  // }
    :global(.profile){
      width:28px !important;
    }
    .become_btn button{
      padding:15px 40px 15px 40px;
      margin-top:10px;
    }

    .join_btn{
      margin:-30px auto;
      width:80%;             
    }

    .cont{
      width:80%;
      margin:30px auto; 
    }
    
    .lorem_p{
      font-size:10px;
      background: var(--gradient);
      border-radius: 20px 40px;
      padding:20px;
      line-height:20px;
    }
    
    .profile_detail{
      display:flex;
      justify-content: flex-end;
      gap:10px;
      align-items: center;
      margin-top:10px;
               
    }
    .name{
      font-size:10px;   
    }
    .email{
      font-size:6px;   
    }

    :global(.comma){
      display:none !important;
    }
    :global(.crousal_btn){
      height:20px;
      min-width:20px;
      border-radius:50%; 
    }

    :global(.aicon){
      height:10px !important;
      width:10px !important;
      min-height:10px !important;
      min-width:10px !important;
    }
      }
      @media screen (min-width:769px) and (max-width:1024px){
        .create {
          display: grid;
          width: 80%;
          //border:2px solid red;
      }
  
      .create div:nth-child(1) {
          width: 90%;
          margin: 0px auto;
      }
      .create div:nth-child(2){
        width:100%;
        display:flex;
         justify-content:center;
      }

      .section_two{
          margin-top:80px;
      }
      .section_three{
          margin-top:80px;
      }
  
      .camera_img {
          gap: 5px;
          max-height: 837px;
      }
  
      .camera_img1 {
          width: 31%;
      }
  
      .camera_img2 {
          width: 44%;
      }
  
      .camera_img3 {
          width: 31%;
      }
  
      .waiting {
          font-size: 24px;
          width: 35%;
      }
  
      .b_news {
          width: 100%;
      }
  
      .news_blogs {
          display: grid;
          flex-direction: column;
          width: 50%;
      }
  
      .live_title {
          font-size: 72px;
      }
  
      .para {
          font-size: 20px;
      }
  
      .four_mobile {
          display: flex;
          gap: 5px;
          margin: 80px auto; 
      }
  
      .four_mobile div:nth-child(2) {
          text-align: center;
      }
      .four_img img{
        max-width:354px;
      }
  
      .stories {
          font-size: 72px;
      }
  
      .chat_creator {
          // width: 90%;
          gap: 20px;
      }
  
      .chat_creator div:nth-child(1) {
          padding-left: 0px;
          width: 100%;
      }

      .chat_creator2{
        display:none;
      }
        
      .chat_creator1 img{
        max-width:380px;      
      }
    
      .p_chat {
          font-size: 72px;
      }
  
      .engage_chat {
          font-size: 20px;
      }
  
      .what {
          padding: 0px 0px;
          margin: 80px 0px 0px 0px;
      }
      .what_people_div {
          font-size: 72px;
      }
  
      }
    
      `}</style>
    </>
  )
}

export default HomePage