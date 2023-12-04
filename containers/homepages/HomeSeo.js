import React from 'react'
import CustomHead from '../../components/html/head'
import useLang from '../../hooks/language'

const HomeSeo = (props) => {
  const [lang] = useLang()
  const homeSeoData = { ...props.seoSettingData, userName: lang.seoHomeTitle, description: lang.seoHomeDesc }
  return (
    <>
      <CustomHead {...homeSeoData} />
        {props.children}
    </>
  )
}

export default HomeSeo;