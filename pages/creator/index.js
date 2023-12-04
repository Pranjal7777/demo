import {click, doller,health, image } from "../../public/Bombshell/images/creator/index"
import Image from 'next/image'
import Head from 'next/head'
import React, { useState } from "react"
import useLang from "../../hooks/language"
import Header from "../../containers/Header"
import Footer from "../../containers/Footer"
import Link from "next/link"
import Seo from "../../components/Seo.js"


const Creatorpage = ({ creatorData1, creatorData2, creatorData3 }) => {
    const [lang] = useLang();
    const [value, setValue] = useState({
        value: 0,
        text: '0k'
    });

    const getRange = (e) => {
        setValue(value => ({...value, value: e.target.value}));
        if (e.target.value < 1000){
            setValue(value => ({...value, text: `${ e.target.value}k`}))
        }
        else{
            setValue(value => ({...value, text: '1 Million'}))
        }
    }
   
    let earn=((value.value/100)*15).toFixed(1)
   
    return (
        <>
            <Seo title={lang.seoCreatorTitle} description={lang.seoCreatorDesc} viewport={true} />
            <Header />
            <div className="title_box">
                <div className="check">
                    <h4 className="becomea text-black">{lang.creatorPageTitle}<span className="update"> {lang.creator}</span> {lang.toUnlock}<span className="update"> {lang.fullPotential} </span></h4>
                    <p className="first">{lang.creatorDescription}</p>
                   <div className="all1"> <Link href={'/signup-as-creator'}><a><button className="pagebtn varient-1">{lang.creatorButton}</button></a></Link></div>
                </div>
                <div className="c_image"><Image src={image} width={430} height={469} alt="blog" />
                </div>
            </div>

            <h1 className="benefit text-black">{lang.creatorBenefits}</h1>
            <div className="monetize-box">
                <div className="mont-img"><Image src={doller} width={430} height={469} alt="doller" /></div>
                <div className="monetize-title text-black"><p><span className="mon_col">{lang.monetize}</span> {lang.monetizeTitle}</p></div>
            </div>
            <div className="grid-message">
                {
                    creatorData1.map((el, i) => (
                        <div className="money" key={i}>
                            <div className="svg-icon">
                                <Image src={el.image} width={38} height={38} alt="sub" className="bbb" />
                            </div>
                            <div>
                                <p className="title">{el.title}</p>
                                <p className="description-grid">{el.desc}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

           <div className="all"> <Link href={'/signup-as-creator'}><a><button className="pagebtn varient-1">{lang.creatorButton}</button></a></Link></div>
            <div className="marketing text-black">
                <p><span className="span-marketing text-black">{lang.m}</span> {lang.marketingTitle}</p></div>
            <div className="grid-message">
                {
                    creatorData2.map((el, i) => (
                        <div className="money" key={i}>
                            <div className="svg-icon">
                                <Image src={el.image} width={38} height={38} alt="sub" className="bbb"/>
                            </div>
                            <div>
                                <p className="title">{el.title}</p>
                                <p className="description-grid">{el.desc}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
           <div className="all"> <Link href={'/signup-as-creator'}><a><button className="pagebtn varient-1">{lang.creatorButton}</button></a></Link></div>
            <div className="health_box">
                <div><Image src={health} width={368} height={378} alt="health" className="h_img" /></div>
                <div>
                    <p className="health_para1 text-black">{lang.healthTitle}</p>
                    <p className="health_desc text-black">{lang.healthDescription}</p>
                </div>
            </div>

            <div className="grid-message">
                {
                    creatorData3.map((el, i) => (
                        <div className="money" key={i}>
                            <div className="svg-icon">
                                <Image src={el.image} width={38} height={38} alt="sub" />
                            </div>
                            <div>
                                <p className="title">{el.title}</p>
                                <p className="description-grid">{el.desc}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="all"><button className="pagebtn varient-1">{lang.downloadBrochure}</button></div>
            <div className="tabel-box">
                <table>
                    <thead>
                        <tr>
                            <th className="col-1 text-black" >{lang.exclusiveFeatures}</th>
                            <th className="col-2 text-black">{lang.bombshell}</th>
                            <th className="col-2 text-black">{lang.fanvue}</th>
                            <th className="col-2 text-black">{lang.onlyfans}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="col-1 line1 text-black" >{lang.creatorcommission}</td>
                            <td className="col-2 text-black">{lang.percentage}</td>
                            <td className="col-2 text-black">{lang.percentage}</td>
                            <td className="col-2 line2 text-black">{lang.percentage}</td>
                        </tr>
                        {/* <tr>
                            <td className="col-1  text-black">{lang.creatorcommission}</td>
                            <td className="col-2 "><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2 "><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                        </tr> */}
                       
                        <tr>
                            <td className="col-1  text-black">{lang.pricelimit}</td>
                            <td className="col-2 text-black">{lang.nolimit}</td>
                            <td className="col-2 text-black">{lang.dollerhundred}</td>
                            <td className="col-2 text-black">{lang.dollereighty}</td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.tipsGifts}</td>
                            <td className="col-2"><Image  className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.liveStreaming}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.couponCodes}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.reels}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.shoutouts}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click"src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.stories}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.videoCalls}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.support}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.ppvfeed}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.ppvMessages}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2 "><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                        </tr>
                      
                        <tr>
                            <td className="col-1 text-black">{lang.creatorcommission}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2 "></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.fanSpendingwallet}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.smartVault}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.watermark}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.webapp}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2 "></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.healthFinancial}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2 "></td>
                        </tr>
                        <tr>
                            <td className="col-1 text-black">{lang.agencyDashboard}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                        </tr>
                        <tr>
                            <td className="col-1 line3 text-black">{lang.marketingTeam}</td>
                            <td className="col-2"><Image className="click" src={click} width={24} height={24} alt="click" /></td>
                            <td className="col-2"></td>
                            <td className="col-2 line4"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
           <div className="all"><Link href={"/signup-as-creator"}><a><button className="pagebtn varient-1">{lang.creatorButton}</button></a></Link></div>

            <div style={{ background: "#F3F3F3", padding: "60px 0px" }}>
                <div className="graph">
                    <div className="graph1">
                        <h1 className="earn_heading text-black">{lang.howmuchTitle}</h1>
                        <p className="rev">{lang.yourRevenue}</p>
                        <p className="rev1">{lang.revenueDescription}</p>
                    </div>
                    <div className="range">
                        <div className="range_r text-black"><span>{value.text}</span><span>{lang.followers}</span></div>
                        <input type="range" min="0" max="1000" value={value.value} id="range2" className="range-input" onChange={getRange} />
                        <div className="value2 text-black">${earn}k</div>
                    </div>
                </div>
                <Link href={"/signup-as-creator"}><a><div className="all2">
                    <button className="pagebtn varient-1">Become a Creator</button>
                </div></a></Link>
            </div>
            <Footer/>
            <style jsx>{`
             :global(body) {
                background: var(--white) !important;
                color: var(--l_altertative_text_color) !important;
                font-family: Raleway !important;
              }
          
        .title_box{
          display:flex;
          justify-content: space-between;
          align-item:center;
          width:90%;
          margin:100px auto;
          gap:20px;
        }
        .check{
         width:60%;
        }
        .becomea{
            font-size: 72px;
            font-weight: 700;
        }
        .c_image{
            width:30%;
        }
        .update{
            background: var(--new-colour-gradient, linear-gradient(135deg, #D33AFF 0%, #FF71A4 100%));
            background-clip: text;
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;

        }
        .first{
            color: var(--secondary, #5F596B);
            font-size: 28px;
            font-weight: 400;
            line-height:40px;
        }
        .benefit{
            text-align:center;
            font-size: 72px;
            font-weight: 700;
        }
        .monetize-box{
            display: flex;
            width:78%;
            gap:35px;
            margin:auto;
            align-items: center;
            justify-content: center;
            padding:0px;
        }
        .monetize-title{
            font-size: 48px;
            font-weight: 700; 
        }
        .grid-message{
            display: grid;
            grid-template-columns: repeat(3,1fr);
            width:90%;
            margin:auto;
            gap:40px;
        }
        .money{
            display:flex;
            border: 1px solid #D7D7D7;
            align-items: center;
            text-align:center;   
            border-radius:12px;
            padding:10px 18px 20px 50px; 
            position: relative; 
        }
        .title{
            color: var(--background-text, #222);
            font-size: 32px;
            font-weight: 700;
        }
        .description-grid{
            color: var(--secondary, #5F596B);
            font-size: 18px;
            font-weight: 400;   
        }
        .svg-icon{
            display:flex;
            width:60px;
            height:60px;
            position:absolute;
            left:-8%;
            background:#F7F7F7;
            border-radius:50%; 
            justify-content: center;    
        }
       .all1{
        text-align:left;
        margin-top:0px;
       }
       .all2{
        display:none;
       }
        .all{
            text-align:center;
            margin:40px auto;
        }
        .marketing{
            font-size: 48px;
            font-weight: 600;
            width:71%;
            margin:80px auto; 
           text-align:center;
        }
        .span-marketing{
            font-size:72px
        }
      
        .tabel-box{
            width:85%;
            margin:auto;   
          }
          table{
            width:100%;
          }
      
          .line1{
            border-top-left-radius: 10px;
          }
          .line2{
            border-top-right-radius:10px;
          }
          .line3{
            border-bottom-left-radius:10px;
          }
          .line4{
            border-bottom-right-radius:10px;
          }
   
        th{
            padding-bottom:10px;
            font-size:28px;
            font-weight: 600;
            background:white;  
           
        }
        th:nth-child(1){
            padding:0px 65px;
        }
      
        tr,td{
            font-size:24px;
            font-weight: 400;  
            background: rgba(255, 113, 164, 0.10); 
            padding-block:10px; 
           
            text-align:left;
            
        }
        tr td:nth-child(2),tr td:nth-child(3),tr td:nth-child(4){
            //border:3px solid blue;
            width:15%
            //padding:-10px;
        }
    
        tr td:first-child{
            //border:2px solid black;
            width:55%;  
            padding:0px 67px;
        }
    
        .col-3{
            background:white;
        }
        .health_box{
            width:85%;
            margin:50px auto;
            gap:50px;
            display:flex;
            align-items:center;
        }

        .health_box div:nth-child(1) {
            width:30%;
            margin-right:auto;
        }
        .health_box div:nth-child(2) {
            width:70%;  
        }
        .health_para1{
           font-size: 48px;
           font-weight: 700;
        }
        .health_desc{
            font-size:28px;
            font-weight:400;
            margin-top:10px;
            }
        .graph{
            //  border:1px solid red;
            width:80%;
            display:flex;
            align-items:center;
            margin:40px auto;  
        }
       
        .earn_heading{
            font-size:45px;
            font-weight:700;
        }
        .rev{
            margin-top:20px;
            font-size:24px;
            font-weight:500;
            color: var(--secondary, #5F596B);
            }
        .rev1{
            margin-top:20px;
            font-size:24px;
            font-weight:400;
            color: var(--secondary, #5F596B);
        }
        .graph1{
            width:60%;
        }
        .range{
            width:40%;
            position:relative;  
        }
        
        .range-input {
            border:none;
            width:100%;
            -webkit-appearance: none;
            padding-block: 8px;
            padding-left: 0px;
            padding-right:0px;
            margin:10px 0px;
            appearance: none; 
            cursor: pointer;
            outline: none;
            border-radius:50px;
            height:2px;
            background: var(--new-colour-gradient,linear-gradient(45deg, rgba(211, 58, 255, 0.20) 0%, #FF71A4 100%));
          }
          
          .range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none; 
            width:100%;
            height: 44px;
            width: 40px;
            background-image:url('/Bombshell/images/creator/thumb1.png');
            border-radius: 50%;
            border: none;
            transition: .2s ease-in-out;
          }
          .range_r{
            text-align: center;
            display:grid;
            font-size:20px;
            font-weight:500;
            position: absolute;
            left: ${value.value / 10}%;
            bottom: 40px;
            transform: translateX(-60%); 
          }
          .value2{
            font-size:20px;
            font-weight:500;
            position :absolute;
            left:${value.value / 10}%;
            transform: translateX(-50%);  
          }
       
    @media screen (max-width:426px){  
        .title_box{
           display:grid;
           margin:50px auto;   
        }
        .becomea{
           font-size:28px;
          }
        .check{
           width:90%;   
         }
        .first{
           font-size:12px;
           margin-top:10px;
           line-height:20px;   
         }
       .c_image{
           width:59%;
           margin:auto;    
         }
      .all1{
        text-align:left;
        // margin-top:-30px;
       }
       .all2{
        display:block;
        text-align:center;
        margin:10px 0px;
       
       }
       .benefit{
           font-size:28px;
      }
      .monetize-box{
          width:90%;
          gap:10px;
          padding:0px;   
    }
    .monetize-title{
        font-size: 16px;     
    }
    .mon_col{
        color: #FF71A4;
    }

    .mont-img{
        margin-top:20px;
        width:105px;
        height:105px;
     }

    .marketing{
        margin:20px auto;
        font-size: 18px;
        width:70%;
        text-align:left;      
       }
    .span-marketing{
        font-size:56px
    }
    .grid-message{
        display: grid;
        grid-template-columns: repeat(1,1fr);
        text-align:center;
        width:75%;
        margin:15px auto;
        gap:35px;      
    }
    .title{
        font-size: 16px;
    }
    .description-grid{
        font-size: 10px;
        padding-top:6px;
        line-height:20px;   
    }
    .money{
        padding:35px 25px 20px 20px; 
        position: relative;      
    }
    .svg-icon{
     //border:1px solid red;
        position:absolute;
        left:39%;
        top:-28px;   
    }
    :global(.svg-icon img){
        height:30px !important;
        width:30px !important;
    }
   
    .health_box{
        width:90%;
        margin:0px auto;
        display:flex;
        gap:0px;
        align-items:center;
        justify-content: space-between;
        flex-direction: row-reverse;  
    }
    .health_box div:nth-child(1) {
        width:40%;  
    }
    .health_box div:nth-child(2) {
        width:60%;  
    }
    .health_para1{
        font-size: 28px;
    }
    .health_desc{
        font-size:10px;
        margin-top:10px;
    }

    .tabel-box{
        width:90%;
    }
   
     th{
        padding:10px;
        font-size:10px;
    }
    tr,td{
    font-size:10px;    
    }

    :global(.click){
        width:16px !important;
        height:16px !important;
        border:1px solid red;
        min-width:auto !important;
        min-height:auto !importnat;
    }

    .graph{
        width:90%;
        display:grid;
        gap:50px;
        align-items:center;
        margin:40px auto;
    }
    .earn_heading{
        font-size:28px;
    }
    .rev{
        margin-top:20px;
        font-size:16px;
        }
    .rev1{
        margin-top:10px;
        font-size:10px;
        line-height:20px;   
    }
    .range_r{
        font-size:10px;
        transform: translateX(-70%);
      }
      .value2{
        font-size:10px;
        transform: translateX(-70%);     
      }
    
      .graph1{
        width:100%;
    }
    .range{
        width:80%;
        margin:auto;
        position:relative;  
    }
    }
    @media screen (min-width:427px) and (max-width:800px){
        .pagebtn{
            padding:8px 25px 8px 25px;   
        }
        .title_box{
        display:grid;
        margin:50px auto;
      }
      .becomea{
       font-size:28px;
      }
      .check{
        width:70%;
      }
      .first{
        font-size:12px;
      }

      .c_image{
        width:49%;
        margin:auto;
       
      }
      .all1{
        text-align:left;
        // margin-top:-30px;
       }
       .all2{
        display:block;
        text-align:center;
        margin:10px 0px;
       }
      .benefit{
        font-size:28px; 
      }
      .monetize-box{
        width:90%;
        gap:10px;
        padding:0px;  
    }
    .monetize-title{
        font-size: 16px;     
    }

    .mont-img{
        margin-top:20px;
        width:105px;
        height:105px;
     }

     .mon_col{
        color: #FF71A4;
    }
    .grid-message{
        display: grid;
        grid-template-columns: repeat(1,1fr);
        width: 47%;
        text-align: center;
        align-items: center;
        gap:30px;
        // border:1px solid red;    
    }
    .title{
        font-size: 16px;
    }

    .description-grid{
        font-size: 10px;
        padding-top:6px;
        line-height:20px;   
    }
    .money{
        padding:50px 20px 30px 20px; 
        position: relative;  
    }
    .svg-icon{
        position:absolute;
        left:38%;
        top:-24px;
    }
    
    .marketing{
        font-size: 18px;
        width:55%;     
    }
    .span-marketing{
        font-size:38px;
    }
    .grid-marketing{
        display: grid;
        grid-template-columns: repeat(1,1fr);
        width:47%;
        margin:50px auto;
        gap:30px;
    }
    .health_box{
        width:90%;
        margin:0px auto;
        display:flex;
        align-items:center;
        justify-content: space-between;
        flex-direction: row-reverse;  
    }
    .health_box div:nth-child(1) {
        width:30%;     
    }
    .health_box div:nth-child(2) {
       width:60%;
    }
    .health_para1{
       font-size: 28px;
    }
    .health_desc{
       font-size:10px;
       margin-top:10px;
       line-height:20px;
    }

    .tabel-box{
      width:90%; 
    }
    
    th{
        padding:10px;
       font-size:10px;
     }
    tr,td{
          font-size:10px;
    }
    
    .graph{
        width:90%;
        display:grid;
        gap:30px;
        align-items:center;
        margin:40px auto;
    }
    .graph1{
        width:100%;
    }
    .range{
        width:80%;
        margin:20px auto;
    }
    .earn_heading{
        font-size:28px;
    }
    .rev{
        margin-top:20px;
        font-size:16px;
     
        }
    .rev1{
        margin-top:10px;
        font-size:10px;
        line-height:20px;
        
    }
    .range_r{
        font-size:16px;
        transform: translateX(-70%);
      }
      .value2{
        font-size:16px;
        transform: translateX(-70%);     
      }
   
    }

    @media screen (min-width:801px) and (max-width:1200px){
        .pagebtn{
            padding:10px 30px 10px 30px;
        }
        .title_box{
            display:flex;
            justify-content: space-between;
            align-item:center;
            width:90%;
            margin:100px auto;
            gap:20px;
          }
          .check{
           font-size: 36px;
           width:60%;
          
          }
          .c_image{
              width:30%;
          }
          .update{
              background: var(--new-colour-gradient, linear-gradient(135deg, #D33AFF 0%, #FF71A4 100%));
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
          }
          .first{
              margin:20px 0px;
              font-size: 16px;
          }   
      .monetize-box{
        width:90%;
        gap:15px;
        padding:0px;
       }
       .benefit{
        font-size:36px;
       }

    .monetize-title{
        font-size: 24px;     
    }
    .mont-img{
        margin-top:20px;
        width:105px;
        height:105px;
     
    }
    .marketing{
        font-size: 36px;
        width:70%;   
    }
    .span-marketing{
        font-size:56px
    }
    .grid-message{
        display: grid;
        grid-template-columns: repeat(3,1fr);
        width: 87%;
        text-align: center;
        gap:30px;  
    }
    .title{
        font-size: 16px;
    }
    .description-grid{
        font-size: 10px;
        padding-top:6px;   
    }
    .money{
        padding:40px 10px 20px 20px; 
        position: relative;
         
    }
    .svg-icon{
        position:absolute;
        left:35%;
        top:-30px;
        background:#F7F7F7;
        border-radius:50%;    
    }
       :global(.svg-icon img){
           height:30px !important;
           width:30px !important;
       }

    .health_box{
        width:90%;
        margin:20px auto;
        display:flex;
        align-items:center;
        justify-content: space-between;
        flex-direction: row-reverse;  
    }

    .health_box div:nth-child(1) {
        width:30%; 
    }
    .health_box div:nth-child(2) {
       width:60%;  
    }
    .health_para1{
       font-size:36px;
    }
    .health_desc{
       font-size:16px;
       margin-top:10px;
       line-height:20px;
        }

        .graph{
            width:90%;
            gap:30px;
            align-items:center;
            margin:40px auto;
        }
        .graph1{
            width:100%;
        }
        .range{
            width:80%;
            margin:20px auto;   
        }
       
        .earn_heading{
            font-size:28px;
        }
        .rev{
            margin-top:20px;
            font-size:16px; 
            }
        .rev1{
            margin-top:10px;
            font-size:10px;
            line-height:20px;    
        }
        .range_r{
            font-size:16px;
            transform: translateX(-70%);
          }
          .value2{
            font-size:16px;
            transform: translateX(-70%);     
          }
       
    }
      `}</style>
        </>
    )

}

Creatorpage.getInitialProps=async()=> {
    const { moneysend,message,calling,airdrop,element,video ,hashtag,personal, wallet, health_icon, ranking, tag, finance} = await import('../../public/Bombshell/images/creator/index.js');
    const creatorData1 = [
        {
          image:moneysend,
          title:"Subscriptions",
          desc:"Charge a monthly subscription fee to access your exclusive content."
        },
        {
          image:message,
          title:"Messaging",
          desc:"Chat with fans, sell content, earn tips/gifts, and send bulk messages"
        },
        {
          image:calling,
          title:"Audio & Video calls",
          desc:"Schedule your availability so fans can pre-book audio/video calls"
        },
        {
          image:airdrop,
          title:"Live Broadcasts",
          desc:"Sell tickets to your livestreams & earn even more from tips/gifts"
        },
        {
          image:element,
          title:"Feeds and Highlights",
          desc: "Earn money with subscriber & PPV feeds, post reels, livestream replays"
        },
        {
          image:video,
          title: "Stories and Reels",
          desc: "Post stories for subscribers & followers, earn tips, and boost user retention",
        }
      
      ]

      const creatorData2=[
        {
          image:hashtag,
          title:"Marketing team",
          desc:"Get discovered by millions of Bombshell users on our platform and socials"
        },
        {
          image:personal,
          title:"Account Management",
          desc:"Take control of your brand with optimized management tools"
        },
        {
          image:wallet,
          title:"Creator Wallet",
          desc:"Always get paid quickly and easily directly to your bank account"
        }
      ]
      const creatorData3=[
        {
          image:health_icon,
          title:"Health Insurance",
          desc:"Affordable health, vision, dental, and life insurance designed for creators"
        },
        {
          image:ranking,
          title:"Premium Perks",
          desc:"27+ premium perks including Teladoc, Health Advocate, Tax Hotline and more"
        },
        {
          image:moneysend,
          title:"Virtual Care",
          desc:"Get 24/7 primary care, mental health, counseling & more with Teladoc"
        },
        {
          image:tag,
          title:"Tax Assistance",
          desc:"Free automated tax withholdings and payments to the IRS"
        },
        {
          image:finance,
          title:"Financial Tracking",
          desc:"Link your bank account to track income and deductible expenses"
        },  
        {
          image:moneysend,
          title:"Federal & State Payments",
          desc:"Make quarterly or annual payments in all 50 states"
        }
      ]
    return {
        creatorData1,
        creatorData2,
        creatorData3
    }
  }

export default Creatorpage