import React, { useState } from 'react';
import Header from "../../header/header"
import CustButton from "../../button/button";
import { useTheme } from "react-jss"
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language"
import * as config from "../../../lib/config";
// import TextArea from '../../textarea/index';
import { backNavMenu, close_drawer } from '../../../lib/global'
import { useDispatch, useSelector } from "react-redux";
import { postShoutoutData } from "../../../redux/actions/shoutout";
import { useEffect } from 'react';

function ShoutoutIntroduce(props) {
  const theme = useTheme()
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [intro, setIntro] = useState('')

  const dispatch = useDispatch();
  const introData = useSelector((state) => state)

  const handleSave = (e) => {
    props.setIntroduction(intro)
    close_drawer("ShoutoutFormIntro")
  }

  return (
    <div className='w-100 h-100'>
      {mobileView
        ? (
          <div className='w-100 h-100'>
            <Header title={lang.shoutoutIntroduce} back={props.onClose} />
            <div className='w-100 position-absolute d-flex flex-column justify-content-between align-items-center' style={{ top: '75px', height: '80%' }}>
              {/* <TextArea
                  className='p-3'
                  value={intro}
                  onChange={(value) => setintro(value)} /> */}

              <textarea
                rows="6"
                maxLength="100"
                autoFocus
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder={lang.shoutOutPlaceholder}
                style={{ width: "92%" }}
              />
              <CustButton
                type="submit"
                style={{ width: '80%' }}
                onClick={() => {
                  handleSave()
                }
                }
                cssStyles={theme.blueButton}
              >
                {lang.save}
              </CustButton>
            </div>
          </div>
        )
        : (<></>)
      }
    </div>
  )
}

export default ShoutoutIntroduce;
