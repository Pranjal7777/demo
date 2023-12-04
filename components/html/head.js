import React from "react";
import NextHead from "next/head";
import {
  APP_NAME,
  OG_TITLE,
  OG_DESC,
  WEB_LINK,
  OG_IMAGE,
  OG_LOGO,
  SMALL_LOGO,
  FB_APP_ID,
  ALT_TEXT
} from "../../lib/config/ogData";

const defaultTitle = APP_NAME;
const defaultOGTitle = OG_TITLE;
const defaultDescription = OG_DESC;
const defaultOGURL = WEB_LINK;
const defaultOGImage = OG_IMAGE;
const defaultAltText = ALT_TEXT;
/**
 * @description use this component to add custome head
 * @author jagannath
 * @date 13/05/2021
 * @param pageTitle: String
 * @param description: String
 * @param metaTags: String['',''] - Array
 * @param url: String - page url
 * @param ogImage: String - open graph image | fb image
 * @param twitterImage: String 
 */
const CustomHead = (props) => {
  const {userName, username} = props;

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{userName || username || defaultTitle}</title>
      <meta name="description" content={props.description || defaultDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
      {props.metaTags && props.metaTags.length > 0 && (
        <meta name="keywords" content={props.metaTags.join(",")}></meta>
      )}
      <link rel="canonical" href={defaultOGURL} />
      <meta property="fb:app_id" content={FB_APP_ID} />
      <link href={SMALL_LOGO} rel="icon" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={props.pageTitle || props.ogTitle || defaultOGTitle || defaultTitle} />
      <meta name="twitter:description" content={props.description || defaultDescription} />
      <meta name="twitter:url" content={props.url || defaultOGURL} />
      <meta name="twitter:site" content={props.url || defaultOGURL} />
      <meta name="twitter:creator" content={props.url || defaultOGURL} />
      <meta name="twitter:image" content={props.twitterUrl || props.ogImage || defaultOGImage} />

      {/* Open Graph / Facebook */}
      <meta property="og:locale" content={props.language || "en"} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.pageTitle || props.ogTitle || defaultOGTitle || defaultTitle} />
      <meta property="og:description" content={props.description || defaultDescription} />
      <meta property="og:url" content={props.url || defaultOGURL} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:image" content={props.ogImage || props.graphUrl || props.facebookUrl || OG_LOGO} />
      <meta property="og:image:secure_url" content={props.ogImage || props.facebookUrl || props.graphUrl || OG_LOGO} />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />
      <meta property="og:image:alt" content={props.altText || defaultAltText} />
    </NextHead>
  )
}

export default CustomHead;
