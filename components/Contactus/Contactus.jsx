import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import isMobile from '../../hooks/isMobile';
import useLang from '../../hooks/language';
import DvHeader from '../../containers/DvHeader/DvHeader';
import { CONTACT_US_BANNER } from '../../lib/config';
import Img from '../ui/Img/Img';
import DVinputText from '../DVformControl/DVinputText';
import useForm from '../../hooks/useForm';
import DVphoneno from '../DVformControl/DVphoneno';
import Button from '../button/button';
import { useTheme } from 'react-jss';
import MarkatePlaceHeader from '../../containers/markatePlaceHeader/markatePlaceHeader';


const Contactus = (props) => {
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const phoneRef = useRef({});
  const theme = useTheme();
  const [
    Register,
    value,
    error,
    isValid,
    setElementError,
    validTik,
    setValidTik,
    setValidInputMsg,
    validMsg,
  ] = useForm({
    defaultValue: { ...(props.signup || {}) },
    emptyAllow: true,
  });
  const [phoneInput, setPhoneInput] = useState({});
  const [phone, setPhone] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [enteredTextMessage, setEnteredTextMessage] = useState('');
  const [signUpdata, setSignupPayload] = useState({
    ...(props.signup || {}),
  });

  const validateEmailAddress = async (inputValue) => {
    return new Promise(async (res, rej) => {
      try {
        VerifyEmail.email = inputValue || value.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie('userType');
        const response = await validateEmail(VerifyEmail);
        res();
      } catch (e) {
        // console.log("ASdsadd", e);
        e.response && setElementError('email', e.response.data.message);
        rej();
      }
    });
  };

  // validate phone no
  const ValidatePhoneNo = () => {
    return new Promise(async (res, rej) => {
      try {
        ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo;
        ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;
        res();
      } catch (e) {
        console.error(phoneRef.current);
        phoneRef.current &&
          phoneRef.current.setError &&
          phoneRef.current.setError(e.response.data.message);
        setElementError('phoneNumbere', e.response.data.message);
        console.error(e.response.data.message);
      }
    });
  };


  return (
    <>
      <>
        {
          mobileView ?
            <div className="w-100 custom_bg_theme">
              <div className="container">
                <div style={{ position: 'sticky', top: '0', zIndex: '999' }} className="w-100 col-12 px-0 py-2 d-flex justify-content-between align-items-center mySubscription">
                  <ul
                    className="breadcrumb breadcrumb__custom bg-transparent mb-0"
                  >
                    <li
                      className="breadcrumb-item cursorPtr"
                      onClick={() => Router.push('/')}
                    >
                      <span>{lang.home}</span>
                    </li>
                    <li className="breadcrumb-item">
                      <span className="active">{lang.contactUs}</span>
                    </li>
                  </ul>
                  <div>
                    <button
                      style={{ fontSize: '35px' }}
                      type="button"
                      className="close custom_cancel_btn dv_appTxtClr"
                      data-dismiss="modal"
                      onClick={() => Router.push('/')}
                    >
                      {lang.btnX}
                    </button>
                  </div>
                </div>
                <div className="col-12 pt-3">
                  <h4 className='txt-heavy fntSz20 dv_appTxtClr'>{lang.sendMessage}</h4>
                  <div className="submit_form py-3">
                    <div className="py-1 name">
                      <p className="mb-2">{`${lang.firstNamePlaceholder}*`}</p>
                      <DVinputText
                        contactus={true}
                        style={{ borderRadius: '20px' }}
                        className="form-control px-3"
                        id="firstName"
                        name="firstName"
                        error={error.firstName}
                        ref={Register({
                          validate: [
                            {
                              validate: 'required',
                              error: lang.firstNameError,
                            },
                          ],
                        })}
                        placeholder={`Marks`}
                        autoFocus
                      />
                    </div>
                    <div className="py-1 email_address">
                      <p className="mb-2">{`${lang.emailPlaceholder}*`}</p>
                      <DVinputText
                        contactus={true}
                        style={{ borderRadius: '20px' }}
                        className="form-control"
                        id={'email'}
                        name="email"
                        error={error.email}
                        ref={Register({
                          onBlur: validateEmailAddress,
                          validate: [
                            {
                              validate: 'required',
                              error: lang.emailError1,
                            },
                            {
                              validate: 'email',
                              error: lang.emailError2,
                            },
                          ],
                        })}
                        placeholder={`Marks@gmail.com`}
                      />
                    </div>
                    <div className="py-1 phoneNumber">
                      <p className='mb-2'>{`${lang.phoneNo}*`}</p>
                      <DVphoneno
                        contactus={true}
                        style={{ borderRadius: '20px' }}
                        className="bg-white"
                        setRef={(childRef) =>
                          (phoneRef.current = childRef.current)
                        }
                        setPhoneNo={setPhoneNo}
                        setPhone={setPhone}
                        setPhoneInput={setPhoneInput}
                        phoneInput={phoneInput}
                        onBlur={() => ValidatePhoneNo()}
                        phoneNo={signUpdata.phoneNumber}
                        countryCode={signUpdata.countrycode}
                        iso2={signUpdata.iso2}
                        placeholder="9999999999"
                      />
                    </div>
                    <div className="comment_msg py-1">
                      <p className='mb-2'>{lang.message}*</p>
                      <textarea
                        value={enteredTextMessage}
                        className="form-control dv_textarea_lightgreyborder"
                        rows={3}
                        // autoFocus={true}
                        list="creators"
                        id="post-caption"
                        placeholder={lang.typeHere}
                        onChange={(e) =>
                          setEnteredTextMessage(e.target.value)
                        }
                      />
                    </div>
                    <div className="submit__button py-2">
                      <Button
                        type="button"
                        disabled={!(
                          isValid &&
                          phoneInput
                        )
                        }
                        cssStyles={theme.blueButton}
                        children={lang.submit}
                        id="scr6"
                      />
                    </div>
                  </div>
                </div>
                <div className="contact_us_description dv_base_bg_color row">
                  <div className="col-12 px-3 py-3">
                    <p className="txt-heavy fntSz18 text-white">{lang.contactUs}</p>
                    <p className="txt-book fntSz14 text-white mb-0">
                      {lang.dummyText}
                    </p>
                  </div>
                  <div className="col-12 py-3 px-0">
                    <div style={{ borderTop: '1px solid #fff' }} className='pt-3 pl-3'>
                      <p className="txt-heavy fntSz18 text-white">{lang.companyInformation}</p>
                      <p className="txt-book fntSz14 text-white mb-0">
                        {lang.officeAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <>
              <MarkatePlaceHeader setActiveState={props.setActiveState} {...props} />
              <div style={{ height: '80px', paddingTop: '80px' }}>
                <div style={{ minHeight: '90vh' }} className="w-100 custom_bg_theme">
                  <div className="container">
                    <div className="col-12 px-0">
                      <ul
                        className="breadcrumb breadcrumb__custom py-4"
                        style={{
                          zIndex: 2,
                          borderRadius: 0,
                          height: '78px',
                          alignItems: 'center',
                        }}
                      >
                        <li
                          className="breadcrumb-item cursorPtr"
                          onClick={() => Router.push('/')}
                        >
                          <span>{lang.home}</span>
                        </li>
                        <li className="breadcrumb-item">
                          <span className="active">{lang.contactUs}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-12 row mx-0">
                      <div className="col-md-6">
                        <div className="contact_us_banner">
                          <Img src={CONTACT_US_BANNER} className="w-100 h-100" />
                        </div>
                        <div className="contact_us_description dv_base_bg_color row mx-0">
                          <div className="col-6 px-2 py-3">
                            <p className="txt-heavy fntSz18 text-white">{lang.contactUs}</p>
                            <p className="txt-book fntSz14 text-white mb-0">
                              {lang.dummyText}
                            </p>
                          </div>
                          <div className="col-6 py-3 px-0">
                            <div style={{ borderLeft: '1px solid #fff' }} className='pl-3'>
                              <p className="txt-heavy fntSz18 text-white">{lang.companyInformation}</p>
                              <p className="txt-book fntSz14 text-white mb-0">
                                {lang.officeAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 px-md-3">
                        <h4 className='txt-heavy fntSz20 dv_appTxtClr'>{lang.sendMessage}</h4>
                        <div className="submit_form py-3">
                          <div className="py-1 name">
                            <p className="mb-2">{`${lang.firstNamePlaceholder}*`}</p>
                            <DVinputText
                              contactus={true}
                              style={{ borderRadius: '20px' }}
                              className="form-control px-3"
                              id="firstName"
                              name="firstName"
                              error={error.firstName}
                              ref={Register({
                                validate: [
                                  {
                                    validate: 'required',
                                    error: lang.firstNameError,
                                  },
                                ],
                              })}
                              placeholder={`Marks`}
                              autoFocus
                            />
                          </div>
                          <div className="py-1 email_address">
                            <p className="mb-2">{`${lang.emailPlaceholder}*`}</p>
                            <DVinputText
                              contactus={true}
                              style={{ borderRadius: '20px' }}
                              className="form-control"
                              id={'email'}
                              name="email"
                              error={error.email}
                              ref={Register({
                                onBlur: validateEmailAddress,
                                validate: [
                                  {
                                    validate: 'required',
                                    error: lang.emailError1,
                                  },
                                  {
                                    validate: 'email',
                                    error: lang.emailError2,
                                  },
                                ],
                              })}
                              placeholder={`Marks@gmail.com`}
                            />
                          </div>
                          <div className="py-1 phoneNumber">
                            <p className='mb-2'>{`${lang.phoneNo}*`}</p>
                            <DVphoneno
                              style={{ borderRadius: '20px' }}
                              className="bg-white"
                              setRef={(childRef) =>
                                (phoneRef.current = childRef.current)
                              }
                              setPhoneNo={setPhoneNo}
                              setPhone={setPhone}
                              setPhoneInput={setPhoneInput}
                              phoneInput={phoneInput}
                              onBlur={() => ValidatePhoneNo()}
                              phoneNo={signUpdata.phoneNumber}
                              countryCode={signUpdata.countrycode}
                              iso2={signUpdata.iso2}
                              placeholder="9999999999"
                            />
                          </div>
                          <div className="comment_msg py-1">
                            <p className='mb-2'>{lang.message}*</p>
                            <textarea
                              value={enteredTextMessage}
                              className="form-control dv_textarea_lightgreyborder"
                              rows={3}
                              // autoFocus={true}
                              list="creators"
                              id="post-caption"
                              placeholder={lang.typeHere}
                              onChange={(e) =>
                                setEnteredTextMessage(e.target.value)
                              }
                            />
                          </div>
                          <div className="submit__button py-2">
                            <Button
                              type="button"
                              disabled={!(
                                isValid &&
                                phoneInput
                              )
                              }
                              cssStyles={theme.blueButton}
                              children={lang.submit}
                              id="scr6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
        }
      </>


      <style jsx>{`
                :global(.custom_bg_theme) {
                    background-color:var(--theme);
                }
            `}
      </style>
    </>
  );
};

export default Contactus;
