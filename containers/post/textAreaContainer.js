import React, { useState, useRef, useEffect } from 'react';
import * as config from '../../lib/config';
import { open_dialog, open_drawer } from '../../lib/global';
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import FigureImage from '../../components/image/figure-image';
import ColorPicker from '../pickers/color-picker';
import FontStylePicker from '../pickers/fontStyle-picker';
import Icon from '../../components/image/icon';
import { useTheme } from "react-jss";
import * as env from "../../lib/config";
import TextStylePicker from '../TextAlignPicker/TextAlignPicker';
import Head from 'next/head';

function TextAreaContainer(props) {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const textareaRef = useRef(null);
  const [textInputPadding, setTextInputPadding] = useState(100)
  const [postText, setPostText] = useState(props.textPost)
  const [lineUpdate, setLineUpdate] = useState(0)
  const [textfontSize, setTextfontSize] = useState(mobileView ? '5' : '2')
  const [heightSet, setHeightSet] = useState('375px')
  const [isTyped, setIsTyped] = useState(null);
  const theme = useTheme();


  const handleIncreaseLine = () => {
    if (props.textPost.length == 35 || props.textPost.length == 60 || props.textPost.length == 85 || props.textPost.length == 130) {
      if (textInputPadding >= 41 && props.textPost.length < postText.length) {
        setTextInputPadding(prev => prev - 20)
      }
      else if (textInputPadding == 40 && props.textPost.length < postText.length) {
        return;
      }
      else if (textInputPadding == 40 && props.textPost.length > postText.length) {
        setTextInputPadding(prev => prev + 20)
      }
      else {
        if ((40 <= textInputPadding && textInputPadding < 92)) {
          setTextInputPadding(prev => prev + 20)
        }
      }
    }
  }

  useEffect(() => {
    if (props.textPost.length >= 130) {
      setTextInputPadding(40)
    }
    else if (props.textPost.length >= 85) {
      setTextInputPadding(60)
    }
    else if (props.textPost.length >= 60) {
      setTextInputPadding(80)
    }
    else {
      setTextInputPadding(100)
    }
  }, [])

  useEffect(() => {
    let heig = heightSet.replace('px', '');
    let fontSizeFromDiv = textareaRef.current.style.fontSize;
    fontSizeFromDiv = parseFloat(fontSizeFromDiv.replace('vw', ''))
    if (mobileView) {
      if (parseFloat(heig) > 430 && isTyped) {
        fontSizeFromDiv -= 0.2;
      }
      if (parseFloat(heig) < 430 && fontSizeFromDiv < 5 && !isTyped) {
        fontSizeFromDiv += 0.2;
      }
    }
    else {
      if (parseFloat(heig) > 430 && isTyped) {
        fontSizeFromDiv -= 0.2;
      }
      if (parseFloat(heig) < 430 && fontSizeFromDiv < 2 && !isTyped) {
        fontSizeFromDiv += 0.2;
      }
    }
    textareaRef.current.style.fontSize = `${fontSizeFromDiv}vw`;
  }, [heightSet])

  useEffect(() => {
    textareaRef.current.style.fontSize = `${mobileView ? '5vw' : '2vw'}`;
  }, [])

  useEffect(() => {
    // textareaRef.current.style.height = "0px";
    // const scrollHeight = textareaRef.current.scrollHeight + 75;
    // textareaRef.current.style.height = scrollHeight + "px";
    // setHeightSet(textareaRef.current.style.height)

    props.handleTexPostChange(postText)
    // handleIncreaseLine()
    // handleDecreaseFontsize()
  }, [postText, textfontSize, props.font])

  return (
    <>
      <Head>
        {/* <link
          href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        /> */}
        <link
          as="style"
          rel="stylesheet preload"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
          type="text/css"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Carter+One&family=Cookie&family=Kaushan+Script&family=Permanent+Marker&family=Rampart+One&display=swap"
          rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Dancing+Script:wght@700&family=Pacifico&display=swap"
        />
      </Head>
      {
        mobileView ? (
          <div
            className=''
            style={{
              width: '100%',
              paddingLeft: '15px',
              paddingRight: '15px',
              position: 'relative',
            }} >
            {
              props.fontStylePicker
                ? <div className='fontStyle__container__mobile'>
                  <FontStylePicker mobileView={mobileView} font={props.font} setFont={props.setFont} />
                </div>
                : <></>
            }
            <textarea
              type='text'
              // id='textArea'
              ref={textareaRef}
              className="form-control textArea dv_textarea_lightgreyborder"
              value={postText}
              autoFocus={true}
              list="creators"
              id="post-caption"
              placeholder="Type here"
              onClick={() => props.onClick(false)}
              onChange={(e) => {
                setIsTyped(postText.length < e.target.value.length);
                e.target.value.length <= 300
                  ? setPostText(e.target.value)
                  : null
              }}
            />
            {
              props.textAlignPicker
                ? <div className='fontStyle__container__mobile'>
                  <TextStylePicker mobileView={mobileView} font={props.textAlign} setTextAlign={props.setTextAlign} />
                </div>
                : <></>
            }
            <div
              style={{
                top: '8px',
                right: '20px',
                width: '127px',
                background: '#0000006b',
                padding: '2px 10px 5px',
                borderRadius: '6px',
              }}
              className='position-absolute fontStyle__contaner__mobile__up'
            >
              <div className='d-flex justify-content-center align-items-center'>

                <div
                  className='text-white cursor-pointer'
                  onClick={() => props.handleTextAlignPicker()}
                  style={{ marginRight: "7px" }}
                >A</div>
                <div>
                  {/* <FigureImage
                    fclassname="mb-0 pointer mr-2"
                    src={config.SMILE_FACE}
                    width={20}
                    height={22}
                    onClick={() =>
                      open_drawer(
                        "emoji",
                        {
                          setPostText: setPostText,
                          textPost: props.textPost
                        },
                        "bottom"
                      )
                    }
                  /> */}


                    <Icon
                      icon={`${env.SMILE_FACE}#smile-face`}
                      color="#ffffff"
                      size={mobileView ? 20 : 15}
                      unit="px"
                      viewBox="0 0 16.472 16.472"
                      class="mr-1"
                      onClick={() =>
                        open_drawer(
                          "emoji",
                          {
                            setPostText: setPostText,
                            textPost: props.textPost
                          },
                          "bottom"
                        )
                      }
                  />

                </div>
                <FigureImage
                  fclassname="mb-0 pointer mr-2"
                  src={config.TEXT_SHAPE}
                  width={20}
                  height={22}
                  onClick={props.handleTextStyleChange}
                />
                <FigureImage
                  fclassname="mb-0 pointer mr-2"
                  src={config.COLOR_PALATTE}
                  width={20}
                  height={22}
                  onClick={() => props.handleColorPicker()}
                />
                {
                  props.colorPicker
                    ? (
                      <div className='color__picker__container__mobile'>
                        <ColorPicker setBgColor={props.setBgColor} />
                      </div>)
                    : <></>
                }
              </div>
            </div>
            <div className='letterCountContainer'>
              <p>
                {300 - postText.length}
              </p>
            </div>

          </div>
        )
          : (
            <div
              style={{
                width: '100%',
                position: 'relative'
              }} >
              {
                props.fontStylePicker
                  ? <div className='fontStyle__container__desktop'>
                    <FontStylePicker mobileView={mobileView} font={props.font} setFont={props.setFont} />
                  </div>
                  : <></>
              }
              <textarea
                // id='textArea'
                type='text'
                ref={textareaRef}
                value={postText}
                className="form-control textArea dv_textarea_lightgreyborder"
                autoFocus={true}
                list="creators"
                id="post-caption"
                placeholder="Type here"
                onClick={() => props.onClick(false)}
                onChange={(e) => {
                  setIsTyped(postText.length < e.target.value.length);
                  e.target.value.length <= 300
                    ? setPostText(e.target.value)
                    : null
                }}
              />
              <div
                style={{
                  bottom: '8px',
                  right: '10px',
                  width: '127px',
                  background: '#0000006b',
                  padding: '2px 10px 5px',
                  borderRadius: '6px'
                }}
                className='fontStyle__contaner__desktop__up position-absolute'
              >

                <div className='d-flex justify-content-between align-items-center' style={{ marginTop: "3px" }}>
                  {
                    props.textAlignPicker
                      ? <div className='fontStyle__container__desktop'>
                        <TextStylePicker mobileView={mobileView} font={props.textAlign} setTextAlign={props.setTextAlign} />
                      </div>
                      : <></>
                  }
                  <div
                    className='text-white cursor-pointer'
                    onClick={() => props.handleTextAlignPicker()}
                  >A</div>
                  <Icon
                    icon={`${config.SMILE_FACE}#Icon_material-tag-faces`}
                    color="#fff"
                    width={20}
                    height={22}
                    style={{ marginTop: '-2px' }}
                    alt="emoji picker"
                    viewBox="0 0 16.472 16.472"
                    class="mb-0 pointer"
                    onClick={() =>
                      open_dialog("emoji", {
                        handleIncreaseLine: handleIncreaseLine,
                        handleTexPostChange: props.handleTexPostChange,
                        setPostText: setPostText,
                        textPost: props.textPost,
                      }, "bottom"
                      )
                    }
                  />
                  <FigureImage
                    fclassname="mb-0 pointer"
                    src={config.TEXT_SHAPE}
                    style={{ marginTop: '-4px' }}
                    width={20}
                    height={22}
                    onClick={() => props.handleTextStyleChange()}
                  />
                  <FigureImage
                    fclassname="mb-0 pointer"
                    src={config.COLOR_PALATTE}
                    style={{ marginTop: '-4px' }}
                    width={20}
                    height={22}
                    onClick={() => props.handleColorPicker()}
                  />
                  {
                    props.colorPicker
                      ? (
                        <div className='color__picker__container'>
                          <ColorPicker setBgColor={props.setBgColor} />
                        </div>)
                      : <></>
                  }
                </div>
              </div>
              <div className='letterCountContainer'>
                <p>
                  {300 - postText.length}
                </p>
              </div>

            </div>
          )
      }
      <style jsx>{`
          textarea::placeholder {
            color: #fff;
            font-size: 25px;
            font-weight: 600;
            letter-spacing: 2px;
          }
          .textArea {
          background: ${props.bgColor};
          color: ${props.textColor};
          text-align: ${props.textAlign} !important;
          height: 375px;
          max-height: 430px;
          padding: ${mobileView ? '50' : '7'}px 7px 75px;
          font-family: ${props.font} !important;
          }

          .grow-wrap {
          display: grid;
          width: 80px;
          height: 100px;
        }
        .grow-wrap::after {
          content: attr(data-replicated-value) " ";
          white-space: pre-wrap;
          visibility: hidden;
        }
        .grow-wrap > textarea {
          resize: none;
          overflow: hidden;
        }
        .grow-wrap > textarea,
        .grow-wrap::after {
          border: 1px solid black;
          padding: 0.5rem;
          font: inherit;
          grid-area: 1 / 1 / 2 / 2;
        }
          .emoji-mart .emoji-mart-scroll {
          overflow-y: scroll;
          overflow-x: hidden;
          height: 132px;
          padding: 0 6px 6px 6px;
          will-change: transform;
      }
      .letterCountContainer {
          position: absolute;
          bottom: -10px;
          left: ${mobileView ? '25px' : '10px'};
          color: #fff;
      }
      .color__picker__container__mobile {
          position: absolute;
          right: 10px;
          top: 35px;
          z-index: 1;
      }
      .color__picker__container {
          position: absolute;
          // right: -235px;
          right: 0px;
          top: -288px;
          z-index: 1;
      }
      .fontStyle__container__mobile {
          background: ${props.bgColor};
          border-bottom-right-radius: 11px;
          border-bottom-left-radius: 11px;
          height: 38px;
          position: absolute;
          width: 91.6%;
          color: #fff;
          bottom: 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
      }
      .fontStyle__container__desktop {
          background: ${props.bgColor};
          position: absolute;
          height: 40px;
          width: 99%;
          color: #fff;
          bottom: 35px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
      }
      .fontStyle__contaner__mobile__up {
          top: -6px;
          right: 14px;
          width: 91.7%;
          height: 30px;
          border-top-left-radius: 11px;
          background: ${props.bgColor};
          border-top-right-radius: 11px;
      }
      .fontStyle__contaner__desktop__up {
          bottom: 2px;
          right: 9px;
          width: 99%;
          height: 30px;
          border-top-left-radius: 11px;
          background: ${props.bgColor};
          border-top-right-radius: 11px;
      }
      .textArea::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
          color: #8c8d8f;
          font-size: ${mobileView ? '5vw' : '2vw'};
        }
      `}
      </style>
    </>
  )
}

export default TextAreaContainer
