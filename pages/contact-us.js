import React from 'react'
import { contact } from "../public/Bombshell/images/contact-us"
import Image from 'next/image';
import Header from '../containers/Header'
import Footer from '../containers/Footer';
import { Toast } from '../lib/global/loader';
import { contactUsRequests } from '../services/auth';
import Seo from '../components/Seo';
import useLang from '../hooks/language';


const ContactUs = () => {
  const [lang] = useLang()
  const [contactDetails, setContactDetails] = React.useState({
    name: "",
    instagramName: "",
    country: "",
    phoneNumber: "",
    email: "",
    message: "",
  })

  const onChangeDetails = (e) => {
    let { name, value } = e.target;
    setContactDetails({ ...contactDetails, [name]: value })
  };

  const postContactDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await contactUsRequests(contactDetails);
      if (res.status === 200) {
        setContactDetails({
          name: "",
          instagramName: "",
          country: "",
          phoneNumber: "",
          email: "",
          message: "",
        })
        Toast("Your form is Submitted", "success");
      }
    } catch (error) {
      console.log(error);
      Toast(error.message, "error");
    }
  }

  return (
    <>
      <Seo title={lang.seoContactUsTitle} description={lang.seoContactUsDesc} viewport={true} />
      <Header />
      <div className='form_section'>
        <div>
          <div className='contactf'>
            <h1 className='text-black'>Contact Us</h1>
            <p className='text-black'>Please fill in the form below and our team will be in contact with you soon</p>
          </div>
          <div className='formData'>
            <form onSubmit={(e) => postContactDetails(e)}>
              <div className='form1'>
                <div >
                  <label className='text-black'>Name</label><br />
                  <input
                    type="text"
                    name='name'
                    required
                    value={contactDetails?.name}
                    onChange={(e) => onChangeDetails(e)}
                    placeholder='Enter Name'
                    className='input field'
                  />
                </div>
                <div >
                  <label className='text-black'>Instagram Username</label><br />
                  <input
                    type="text"
                    required
                    name='instagramName'
                    placeholder='Enter Instagram Username'
                    className='input field'
                    onChange={(e) => onChangeDetails(e)}
                  />
                </div>
              </div>
              <div className='form1'>
                <div >
                  <label className='text-black'>Country</label><br />
                  <input
                    type="text"
                    required
                    name='country'
                    placeholder='Enter Country'
                    className='input field'
                    onChange={(e) => onChangeDetails(e)}
                  />
                </div>
                <div>
                  <label className='text-black'>Phone No </label><br />
                  <input
                    type="number"
                    required
                    name='phoneNumber'
                    placeholder='Enter Phone Number'
                    className='input field'
                    onChange={(e) => onChangeDetails(e)}
                  />
                </div>
              </div>
              <div >
                <label className='text-black'>Email</label><br />
                <input
                  type="email"
                  name='email'
                  required
                  placeholder='Enter Email'
                  className='input fieldE'
                  onChange={(e) => onChangeDetails(e)}
                />
              </div>
              <div>
                <label className='text-black'>Message</label><br />
                <textarea
                  placeholder="Enter Message"
                  rows="8"
                  cols="50"
                  required
                  name='message'
                  className='input fieldT'
                  onChange={(e) => onChangeDetails(e)}
                >
                </textarea>
              </div>
              <div className='formb'><button className="pagebtn varient-1">Send</button></div>
            </form>
          </div>
        </div>
        <div>
          <Image src={contact} width={368} height={368} alt='star' className='contact_image' />
        </div>
      </div>
      <Footer />
      <style jsx>{
        `
        :global(body) {
            background: var(--white) !important;
            color: var(--l_altertative_text_color) !important;
            font-family: Raleway !important;
          }
          .form_section{
            display:flex;
            width:90%;
            margin:50px auto;
            justify-content: space-between;
            align-items: center; 
            max-width:1300px; 
          }
         
        h1{
          font-size: 80px;
          font-weight: 700;
        }
        p{
          font-size: 20px;
          font-weight: 400; 
        }
        label {
          margin: 0;
        }
        .form1{
          display:flex;
          gap:30px;
         
        }
        .form1 div:nth-child(1),.form1 div:nth-child(2){ 
          width:50%;
        }
        .field{
          width:100%;  
        }
        .fieldE{
          width:48%;  
        }
        .fieldT{
          width:100%;  
        }
        input{
          outline: none;
          font-size: clamp(10px, 2.5vw, 16px);
          padding-block: 10px;
          padding-left: 10px;
          padding-right:0px;
          border-radius:5px;
          margin:10px 0px; 
        }
        textarea{
          padding:10px;
          border: 1px solid var(--transparent-border);
          border-radius:5px;
        }
        textarea::placeholder,input::placeholder {
          color: var(--secondary-2, #B7A6AE);
          font-size:16px;
      }
        .formData{
          margin:40px auto;
         
        }
        textarea{
          margin-top:10px;
        }
        button{
          margin-top:20px;
        }
      .formb{
        text-align:center;
      }
      .contactf{
        text-align:center;
       
      }
      
        @media screen (min-width:100px) and (max-width:426px){
          .form_section{
            display:column;
            flex-direction: column-reverse;
            width:80%;
            margin:50px auto;
            justify-content: space-between;
            gap:20px;
          }
          .contactf{
            width:70%;
            margin-top:40px;
            margin:auto;
          }
          h1{
            font-size: 30px;
            font-weight: 700;
          }
          p{
            font-size:12px;
            margin-top:10px;  
          }
          textarea::placeholder,input::placeholder {
            color: var(--secondary-2, #B7A6AE);
            font-size:12px;
        }
        .formb button{
          width:100%;  
        }
        .form1{
          display:grid;
          gap:0px; 
        }
        .form1 div:nth-child(1),.form1 div:nth-child(2){ 
          width:100%;
        }
        .fieldE{
          width:100%; 
        }
        .formData{
          margin:30px 0px;
         
        }
     
        }

        @media screen (min-width:428px) and (max-width:768px){
          .form_section{
            display:column;
            flex-direction: column-reverse;
            width:100%;
            margin:50px auto;
            justify-content: space-between;
            gap:20px;
          }
          .contactf{
            width:70%;
            text-align:center;
            margin-top:40px;
            margin:auto;
          }
          h1{
            font-size: 30px;
            font-weight: 700;
          }
          p{
            font-size:12px;
            margin-top:10px;  
          }
          textarea::placeholder,input::placeholder {
            color: var(--secondary-2, #B7A6AE);
            font-size:12px;
        }
       
        .form1{
          display:grid;
          gap:0px;
        }
        .form1 div:nth-child(1),.form1 div:nth-child(2){ 
          width:100%;
        }
        .formb button{
          width:100%;  
        }
        .fieldE{
          width:100%; 
        }
        }

        @media screen (min-width:769px) and (max-width:1200px){
          .form_section{
            display:column;
            flex-direction: column-reverse;
            width:100%;
            margin:50px auto;
            justify-content: space-between;
            gap:20px;
          }
          .contactf{
            width:100%;
            text-align:center;
            margin-top:40px;
            margin:auto;
          }
          h1{
            font-size: 30px;
            font-weight: 700;
          }
          p{
            font-size:16px;
            margin-top:10px;  
          }
          textarea::placeholder,input::placeholder {
            font-size:12px;
        }
       
        .form1{
          display:grid;
          gap:0px;
        }
        .form1 div:nth-child(1),.form1 div:nth-child(2){ 
          width:100%;
        }
        .formb button{
          width:100%;  
        }
        .fieldE{
          width:100%; 
        }
      
        }
        `
      }

      </style>

    </>
  )
}

export default ContactUs;