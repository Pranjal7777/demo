import { getCookie } from "../session";

// color
export const black4 = '#242A37';

// timer
export const DRAWER_TOASTER_TIME = 2000;
export const defaultCurrency = '$';
export const defaultCurrencyCode = 'USD';
export const defaultCountry = "US";
export const test_defaultCountry = 'IN';

export const defaultLang = 'en';
export const defaultTimeZone = () => (getCookie('zone') !== "undefined" && getCookie('zone')) || Intl.DateTimeFormat().resolvedOptions().timeZone;
export const isCameoTheme = process.env.NEXT_PUBLIC_ISCAMEO;

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;
// Fetch support email from Config API
export const SUPPORT_EMAIL = 'tech@bombshellinfluencers.com';
// export const WEB_LINK = "http://localhost:3000";
export const WEB_LINK = process.env.NEXT_PUBLIC_WEB_LINK;
export const API_URL = 'https://api.testbombshellsite.com';
export const USER_NAME = 'bombshell';
export const PASSWORD = 'admin@testbombshellsite.com';
export const MQTT_URL = 'wss://mqtts.testbombshellsite.com:2083/mqtt';
export const MQTT_PASSWORD = 'BoMb2hzTxwBU6eyj';
export const MQTT_USERNAME = 'bombshellveremq';
export const ALT_TEXT = process.env.NEXT_PUBLIC_ALT_TEXT;

export const PROJECTS_CREDS = {
  accountId: '643ea29420aaf50001070ac7',
  userSecret: 'SFMyNTY.g3QAAAACZAAEZGF0YXQAAAADbQAAAAlhY2NvdW50SWRtAAAAGDY0M2VhMjk0MjBhYWY1MDAwMTA3MGFjN20AAAAIa2V5c2V0SWRtAAAAJDc1NzhmYjcxLWQyNjItNGMyZi1iNGRjLWNkMGMwNzQ5MDRhOG0AAAAJcHJvamVjdElkbQAAACQwNTg0Mzg0Zi0xOWJhLTRiODAtOWQyNS00NzQ1MDljZWIxZTdkAAZzaWduZWRuBgAbIq-UhwE.5f_HqpUseV-zNWY3Bq0FKnpj2z6TVBmkHOx1gLxP3kY',
  projectId: '0584384f-19ba-4b80-9d25-474509ceb1e7',
  licenseKey: 'lic-IMKdwqAmUJGARMalVE3APneqSnEYreBqZfu',
  keysetId: '7578fb71-d262-4c2f-b4dc-cd0c074904a8',
  appSecret: 'SFMyNTY.g3QAAAACZAAEZGF0YXQAAAADbQAAAAlhY2NvdW50SWRtAAAAGDY0M2VhMjk0MjBhYWY1MDAwMTA3MGFjN20AAAAIa2V5c2V0SWRtAAAAJDc1NzhmYjcxLWQyNjItNGMyZi1iNGRjLWNkMGMwNzQ5MDRhOG0AAAAJcHJvamVjdElkbQAAACQwNTg0Mzg0Zi0xOWJhLTRiODAtOWQyNS00NzQ1MDljZWIxZTdkAAZzaWduZWRuBgAQIq-UhwE.p_NXSuYWmYotKpLG733Ivi4_yVTDASNeHfLTXLxqD6g',
  isometrikAppSecret: "SFMyNTY.g3QAAAACZAAEZGF0YXQAAAADbQAAAAlhY2NvdW50SWRtAAAAGDY0M2VhMjk0MjBhYWY1MDAwMTA3MGFjN20AAAAIa2V5c2V0SWRtAAAAJGExYjVkZTZkLTU5OTMtNDFkYi05MWExLWQ0MWQxZWQ2OGEzM20AAAAJcHJvamVjdElkbQAAACQ2NDk0Mjc2NC00OWQzLTQ2NzgtYWU4Yy00ZWNiMDhlMGM3YWFkAAZzaWduZWRuBgDDcacLiQE.6veiLxvBSZxvNIuzoAFWXgJJW1pGj8y3tSxGIk0tSd0"
}

export const ISOMETRIK_MQTT_CREDS = {
  URL: 'wss://connections.isometrik.io:2053/mqtt',
  Username: '2' + PROJECTS_CREDS.accountId + PROJECTS_CREDS.projectId,
  Password: PROJECTS_CREDS.licenseKey + PROJECTS_CREDS.keysetId,
  API_URL: 'https://apis.isometrik.io',
};

export const ISOMETRIK_MQTT_TOPICS = {
  Message: `/${PROJECTS_CREDS.accountId}/${PROJECTS_CREDS.projectId}/Message/`,
  PresenceEvents: `/${PROJECTS_CREDS.accountId}/${PROJECTS_CREDS.projectId}/Status/`,
  NewMessageEvent: `/${PROJECTS_CREDS.accountId}/${PROJECTS_CREDS.projectId}/`,
};

export const IVS_STREAM_DNS = 'ivs-ws.isometrik.io';
export const LIVEKIT_STREAM_DNS = 'streaming.isometrik.io'

// export const AGORA_APP_ID = "5433133816394c9c80cf73305104bdf6";
// export const AGORA_TOKEN = "0065433133816394c9c80cf73305104bdf6IAA+trr/6Q71BqUh6oCqZMCcxdtpY4GYkeI1f6eLWpiafQ1vwEAAAAAAEAAWylBU/vsMYgEAAQD++wxi";
// export const AGORA_CHANNEL_NAME = "Anonymous";

// Folder Name
export const FOLDER_NAME_IMAGES = {
  videoThumb: 'videoThumbnail',
  story: 'story',
  post: 'posts',
  profile: 'profile',
  profileBanner: 'profileBanner',
  profileNewBanner: 'profileNewBanner',
  chatMedia: 'chatMedia',
  streamMedia: 'streamMedia',
  shoutOut: 'shoutOut',
  reportImages: 'reportImages',
  crmMedia: "crmMedia"
};

// Making it Dynamic using /cloudinary API
export const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/';
export const CLOUDINARY_IMAGE = '/image/upload/';
export const CLOUDINARY_VIDEO = '/video/upload/';
export const CLOUDINARY_API_BASE = 'https://api.cloudinary.com/v1_1/';

export const FIREBASE = 'AAAAiZYkaJc:APA91bGlU5MDg9pRwcPKLOnvGd10EgsQWikTuQIg3OxUiX-HrqCd5DhQdqWgyxmawdmmKLHCNUrmk8xHcYNrIgxigSnH4BJkzpKG5N6dk2OSKNm8UBB7Pv76Z2zA8IaVQbRRacq1s_Ef';
export const FCM_TOPIC = 'fcm_topic';
export const FCM_TOKEN = 'fcm_token';
export const OG_IMAGE = BASE_PATH + '/images/og_image/og_image.png';
export const APP_ICON = BASE_PATH + '/images/app_icons/icon-256x256.png';
export const DESCRIPTION =
  `${APP_NAME} - Hottest Content From The Hottest Creators Around The World. We Curate Every Single Creator And Ensure All The Posts Are Unique And Completely Original`;
export const DEFAULT_LANGUAGE = 'en';
export const FAV_ICON16 = BASE_PATH + '/images/app_icons/favicon.png';
export const FAV_ICON36 = BASE_PATH + '/images/app_icons/favicon.png';
export const OG_TITLE = APP_NAME;
export const OG_DESC =
  `${APP_NAME} - Hottest Content From The Hottest Creators Around The World. We Curate Every Single Creator And Ensure All The Posts Are Unique And Completely Original.`;

// Go Live Screen
export const GO_LIVE_SCREEN = {
  profLogo: BASE_PATH + '/images/go_live_screen/prof-logo.jpeg',
  close: BASE_PATH + '/images/go_live_screen/close.svg',
  dollarCoin: BASE_PATH + '/images/go_live_screen/dollar-coin.png',
  emoji: BASE_PATH + '/images/go_live_screen/emoji.svg',
  heartStatIco: BASE_PATH + '/images/go_live_screen/heart__stat__ico.svg',
  settingIco: BASE_PATH + '/images/go_live_screen/ionic-ios-settings.svg',
  deleteIco: BASE_PATH + '/images/go_live_screen/material-delete.png',
  menuDrawer: BASE_PATH + '/images/go_live_screen/menu-drawer.svg',
  newFansIco: BASE_PATH + '/images/go_live_screen/new__fans__ico.svg',
  beautifyIco: BASE_PATH + '/images/go_live_screen/noun_beautify_3283121.svg',
  friendsIco: BASE_PATH + '/images/go_live_screen/noun_friends_1205616.png',
  shareIco: BASE_PATH + '/images/go_live_screen/noun_Share_1570728.png',
  otherProfIco: BASE_PATH + '/images/go_live_screen/other-prof-1.jpg',
  photoCamera: BASE_PATH + '/images/go_live_screen/photo-camera.svg',
  smileIco: BASE_PATH + '/images/go_live_screen/smile.svg',
  uCoinIco: BASE_PATH + '/images/go_live_screen/uCoins_ico.svg',
  userSolidIco: BASE_PATH + '/images/go_live_screen/user-solid.svg',
  NoStreamPlaceholder: BASE_PATH + '/images/go_live_screen/No_Streams_Placeholder.svg',
  dollarStreamIco: BASE_PATH + '/images/go_live_screen/stream_coin.svg',
  streamUserIco: BASE_PATH + '/images/go_live_screen/streamUserIco.svg',
  plusBlueIco: BASE_PATH + '/images/go_live_screen/Plus_Icon.svg',
  streamNavigateArrow: BASE_PATH + '/images/go_live_screen/streamChangeArrow.svg',
  muteIcon: BASE_PATH + '/images/go_live_screen/mute_icon.svg',
  chatIcon: BASE_PATH + '/images/go_live_screen/chat_stream_ico.svg',
  streamLockIcon: BASE_PATH + '/images/go_live_screen/stream_locked.svg',
  tipSentGif: BASE_PATH + '/images/go_live_screen/tip_3_second.gif',
  clockIcon: BASE_PATH + '/images/go_live_screen/clock_ico.svg',
  goLiveArrowIco: BASE_PATH + '/images/go_live_screen/go_live_arrow_ico.svg',
  whiteDollarIco: BASE_PATH + '/images/go_live_screen/white_dollar_ic.svg',
  audioMuteIco: BASE_PATH + '/images/go_live_screen/audio_volume_off_ico.svg',
  chatHideIco: BASE_PATH + '/images/go_live_screen/chat_off_ico.svg',
  tickIco: BASE_PATH + '/images/go_live_screen/stream_tick.svg',
  infoIco: BASE_PATH + '/images/go_live_screen/info_icon.svg',
  crossIconWhite: BASE_PATH + '/images/go_live_screen/cross_icon_white.svg',
  fanzlyLogoStreamDetail: BASE_PATH + '/images/go_live_screen/fanzly_logo_stream_detail.svg',
  WebBGLivestream: BASE_PATH + '/images/go_live_screen/WebBGLivestream.png',
  calendarAddIcon: BASE_PATH + '/images/go_live_screen/calendar_add_option.svg',
  streamShareIcon: BASE_PATH + '/images/go_live_screen/stream-share.svg',
  viewerCountIcon: BASE_PATH + '/images/go_live_screen/eye.svg',
  addToCalendar: BASE_PATH + '/images/go_live_screen/calendar_icon_stream.svg',
  share_stream_icon: BASE_PATH + '/images/go_live_screen/share_stream.svg',
  delete_stream_icon: BASE_PATH + '/images/go_live_screen/delete_stream.svg',
};

export const MQTT_TOPIC = {
  Message: 'Message',
  Acknowledgement: 'Acknowledgement',
  Calls: 'Calls',
  UserUpdates: 'UserUpdates',
  FetchMessages: 'FetchMessages',
  OnlineStatus: 'OnlineStatus',
  typ: 'Typ',
  blockUser: 'BlockUser',
  streamStarted: 'streamStarted',
  streamStopped: 'streamStopped',
  streamSentTip: 'streamSentTip',
  virtualOrder: 'virtual-order',
  universalMessage: 'UniversalMessage',
};

// trigger
export const TRIGGER_POINT = {
  sale: 'ALL',
  VIP_CHATS: 'VIP_CHATS',
  entry: 'ENTRY',
  sent: 'SENT',
};

// app logo
export const LOGO = BASE_PATH + '/images/logo.svg';
export const DARK_LOGO = BASE_PATH + '/images/darkLogo.svg';
export const DESK_LOGO = BASE_PATH + '/images/logo.png';
export const OG_LOGO = OG_IMAGE;
export const FB_APP_ID = '1344493016062063';
export const SMALL_LOGO = BASE_PATH + '/images/app_icons/favicon.png';

export const BG_VERIFYEMAIL_SCREEN = BASE_PATH + '/images/bg/splash-bg.jpg';
// splash screen assests
export const BG_SPLASH_SCREEN = BASE_PATH + '/images/bg/scr1.jpg';

// registration screen assets
export const signupBackground = BASE_PATH + '/images/bg/scr4.jpg';
export const signupBackgroundUser = BASE_PATH + '/images/bg/scr6.jpg';
export const FRONT_ARROW = BASE_PATH + '/images/icons/front-arrow.svg';
export const circled_eye = BASE_PATH + '/images/icons/Subtraction.svg';
export const ProfilePlaceholder = BASE_PATH + '/images/icons/upload-icon.svg';
export const calenderIcon = BASE_PATH + '/images/icons/calendar-icon.svg';
export const profileSubmmited = BASE_PATH + '/images/logo.png';
export const backgroudDocument = BASE_PATH + '/images/bg/scr25.jpg';

// Icons For Login form
export const BG_IMAGE = BASE_PATH + '/images/bg/scr2.jpg';
export const HIDE_PASSWORD = BASE_PATH + '/images/icons/hide-password.svg';
export const SHOW_PASSWORD = BASE_PATH + '/images/icons/show-password.svg';
export const RIGHT_ARROW = BASE_PATH + '/images/icons/right-arrow-baseClr.svg';
export const GOOGLE_ICON = BASE_PATH + '/images/icons/_x31__stroke.svg';
export const GOOGLE_ICON1 = BASE_PATH + '/images/google.png';
export const FACEBOOK_ICON = BASE_PATH + '/images/facebook.png';
export const LOGIN_BANNER = BASE_PATH + '/images/loginbanner.png'
export const LOGIN_BANNERUSER = BASE_PATH + '/images/loginbanneruser.png'
export const LOGIN_BANNERCREATOR = BASE_PATH + '/images/loginbannercreator.png'
export const SIGNUP_BANNER_CREATOR_1 = BASE_PATH + '/images/Signupbannercreator1.png'
export const SIGNUP_BANNER_CREATOR_2 = BASE_PATH + '/images/Signupbannercreator2.png'
export const SIGNUP_BANNER_CREATOR_3 = BASE_PATH + '/images/Signupbannercreator3.png'
export const desktopIcon = BASE_PATH + '/images/app_icons/empty-image-holder.svg';

// Juicy logo
export const JUICY_HEADER_LOGO = BASE_PATH + '/images/juicy-header-logo.svg';
export const JUICY_HEADER_DARK_LOGO = BASE_PATH + '/images/juicy-header-dark-logo.svg';
export const DARK_LOGO_HEADER = BASE_PATH + '/images/agency/logo.svg';
export const CREATOR_FRAME = BASE_PATH + '/images/CreatorFrame.svg';
export const FANS_FRAME = BASE_PATH + '/images/fans-bottom.svg';
export const MENUBAR_ICON = BASE_PATH + '/images/menubar_toggle_icon.svg';
export const JUICY_FACEBOOK = BASE_PATH + '/images/Facebook.svg';
export const JUICY_TWITTER = BASE_PATH + '/images/Twitter.svg';
export const JUICY_INSTAGRAM = BASE_PATH + '/images/Instagram.svg';
export const JUICY_LINKEDIN = BASE_PATH + '/images/LinkedIn.svg';
export const JUICY_YOUTUBE = BASE_PATH + '/images/YouTube.svg';
export const JUICY_TIKTOK = BASE_PATH + '/images/tik_tok.svg';
export const JUICY_REDDIT = BASE_PATH + '/images/reddit.svg';
export const PRIVACY_LOGO = BASE_PATH + '/images/round-privacy-tip.svg';
export const SUPPORT_CREATOR_LOGO = BASE_PATH + '/images/support-creator.svg';
export const SUPPORT_FANS_LOGO = BASE_PATH + '/images/support-fans.svg';
export const USER_LOGO = BASE_PATH + '/images/support-user-fill.svg';

// juicy creator
export const CREATOR_GROUP = BASE_PATH + '/images/creator-img/creator-group.svg';
export const CREATOR_GROUP1 = BASE_PATH + '/images/creator-img/creator-group1.svg';
export const CREATOR_GROUP2 = BASE_PATH + '/images/creator-img/creator-group2.svg';
export const CREATOR_GROUP3 = BASE_PATH + '/images/creator-img/creator-group3.svg';
export const CREATOR_GROUP4 = BASE_PATH + '/images/creator-img/creator-group4.svg';
export const CREATOR_GROUP5 = BASE_PATH + '/images/creator-img/creator-group5.svg';
export const CREATOR_GROUP6 = BASE_PATH + '/images/creator-img/creator-group6.svg';

// juicy network
export const SIDEBAR_ORDER = BASE_PATH + '/images/sidebar_icons/Bag.svg';
export const SIDEBAR_MORE = BASE_PATH + '/images/sidebar_icons/More.svg';
export const SIDEBAR_CREATE = BASE_PATH + '/images/sidebar_icons/Plus.svg';
export const SIDEBAR_LIVE = BASE_PATH + '/images/sidebar_icons/Live.svg';
export const SIDEBAR_SCHEDULE = BASE_PATH + '/images/sidebar_icons/Schedule.svg';
export const SIDEBAR_VIDEO = BASE_PATH + '/images/mobile/video.svg';
export const SIDEBAR_REFER = BASE_PATH + '/images/mobile/moneysend.svg';
export const SIDEBAR_REPORT_PROBLEM = BASE_PATH + '/images/mobile/messagequestion.svg';
export const SIDEBAR_COLLECTION = BASE_PATH + '/images/mobile/save2.svg';
export const SIDEBAR_LANGUAGE = BASE_PATH + '/images/mobile/translate.svg';
export const SIDEBAR_SEARCH = BASE_PATH + '/images/sidebar_icons/Search.svg';
export const SIDEBAR_PURCHASE = BASE_PATH + '/images/sidebar_icons/Purchase.svg';
export const SIDEBAR_DOCUMENT = BASE_PATH + '/images/sidebar_icons/Document.svg';
export const SIDEBAR_PROFILE_HEADER = BASE_PATH + '/images/sidebar_icons/profile-header-logo.svg';
export const SIDEBAR_NOTIFICATION = BASE_PATH + '/images/sidebar_icons/Notification.svg';
export const SIDEBAR_USER = BASE_PATH + '/images/sidebar_icons/User.svg';
export const SIDEBAR_MESSAGE = BASE_PATH + '/images/sidebar_icons/Message.svg';
export const SIDEBAR_HOME = BASE_PATH + '/images/sidebar_icons/Home.svg';
export const BECOME_CREATOR = BASE_PATH + '/images/sidebar_icons/become-creator.svg';


// Forget Password Screen
export const BG_FORGET_PASSWORD = BASE_PATH + '/images/bg/scr4.jpg';

export const scr1 = BASE_PATH + '/images/bg/scr1.png';
export const scr2 = BASE_PATH + '/images/bg/scr2.png';
export const scr3 = BASE_PATH + '/images/bg/scr3.png';
export const scr4 = BASE_PATH + '/images/bg/scr4.png';
export const scr5 = BASE_PATH + '/images/bg/scr5.png';
export const scr6 = BASE_PATH + '/images/bg/scr6.png';
export const scr7 = BASE_PATH + '/images/bg/scr7.png';

// Iocns for video call Section
// Iocns for Story Section

// SOCIAL LOGIN CREDS
// SOCIAL LOGIN CREDS // gogoleId development--> 271089609281-0tt65cpgjpnn4eh90pttp6hl16gi0vl5.apps.googleusercontent.com // google Id production --> 271089609281-3l8im3l76fco1sokpim3lkns18lul200.apps.googleusercontent.com
export const GOOGLE_ID = '590929488023-ijdvnftcubmpho4vgpggg7ctfefgroiq.apps.googleusercontent.com';
export const FACEBOOK_ID = '696912407989774';
export const TWITTER_CONSUMER_KEY = 'CXfsTms8VvYEkXfDy4cllMRll';
export const TWITTER_CONSUMER_SECRET =
  'ZmjSY1lUiOmjSiWSs7Uwyhq9PD2XKzNunkkMSF2Ecy4ahvNnUz';
export const MAP_KEY = 'AIzaSyB5Xj_33Ld1cVJeUoZzzNMkSiAto_CCZrA';
export const BITLY_KEY = '2781e18797d8530f426f81e6f8509c6bbdf5a854';

// toaster drawer
export const DRAWER_CLOSE = BASE_PATH + '/images/icons/logout.svg';

// logout icons
export const LOGOUT = BASE_PATH + '/images/icons/logout-wht.svg';

// drawers
export const MENU_LOGOUT = BASE_PATH + '/images/icons/menu-down.svg';

// document
export const DOCUMNET_UPLOAD = BASE_PATH + '/images/icons/image-icon.svg';
export const CANCEL_UPLOAD = BASE_PATH + '/images/icons/cancel.svg';
export const CANCELCLR = BASE_PATH + '/images/icons/cancel_blu_clr.svg';

// desktop document
export const DV_DOCUMNET_UPLOAD = BASE_PATH + '/images/icons/driving-license.svg';

// SOSCIAL LOGIN FIELDS AND SCOPES
export const FACEBOOK_FIELDS = 'name,email,picture';
export const FACEBOOK_SCOPES = 'public_profile,user_friends,email';

// desktop login
export const dvLoginImg = BASE_PATH + '/images/desktop/dvLoginImg.svg';
export const googleIcon = BASE_PATH + '/images/desktop/googleicon.svg';
export const facebookIcon = BASE_PATH + '/images/desktop/facebookicon.svg';
export const twitterIcon = BASE_PATH + '/images/desktop/twittericon.svg';
export const freelyLogo = BASE_PATH + '/images/dv_logo.png';
export const password = BASE_PATH + '/images/icons/password-visible.svg';
export const iconStroke = BASE_PATH + '/images/icons/_x31__stroke.svg';
export const passwordBlack = BASE_PATH + '/images/desktop/icons/password_visible_black.svg';
export const passwordHideBlack = BASE_PATH + '/images/icons/password-invisible.svg';
// export const desktopIcon = BASE_PATH + '/images/desktop/icons/upload_default.svg';
export const LEFT_ARROW = BASE_PATH + '/images/desktop/icons/left-arrow.svg';

export const checkedLogo = BASE_PATH + '/images/icons/check.svg';

// TIMELINE PAGE
export const HUMBERGER_ICON_LIGHT = BASE_PATH + '/images/icons/humberger-icon-light.svg';
export const TIP_ICON = BASE_PATH + '/images/mobile/time line icons/tip_icon.svg';
export const TIP_ICON_WHITE = BASE_PATH + '/images/icons/dollar-symbol-white.svg';
export const DISLIKE_ICON = BASE_PATH + '/images/mobile/time line icons/unLike.svg';
export const FILM_ICON = BASE_PATH + '/images/icons/film.svg';

export const MULTIPLE_IMAGE_ICON = BASE_PATH + '/images/icons/multiple-image.png';
export const EMPTY_POST_ICON = BASE_PATH + '/images/icons/empty-post.png';
// export const IMAGE_LOCK_ICON_PNG = BASE_PATH + "/images/icons/lock-icon.png";
export const DIAMOND_COLOR = BASE_PATH + '/images/icons/diamond_clr.svg';

export const UNLOCK_ICON = BASE_PATH + '/images/mobile/svg/unlocked.svg';
export const DOLLAR_ICON_BG = BASE_PATH + '/images/icons/DollarBg.svg';

// TIMELINE BOTTOM NAV BAR ICONS FOR MODEL
export const TIMELINE_PLACEHOLDER =
  BASE_PATH + "/images/mobile/svg/timeline_placeholder.svg";
export const DASHBOARD_ICON = BASE_PATH + "/images/mobile/svg/noun_dashboard_3493466.svg";
export const SHOUTOUT_ICON = BASE_PATH + "/images/mobile/svg/shoutout.svg";
export const SHARE_ICON_DARK_BLACK =
  BASE_PATH + '/images/desktop/icons/share_icon_dark.svg';
export const EMPTY_PROFILE =
  BASE_PATH + '/images/mobile/placeholderImages/empty-profile.svg';



// TIMELINE BOTTOM NAV BAR ICONS FOR USER



// PROFILE
export const EDIT_PROFILE_ICON = BASE_PATH + '/images/mobile/svg/edit_profile_icon.svg';
export const DEFAULT_BANNERS = BASE_PATH + '/images/mobile/banners/lady.jpg';
export const BLACK_COLOR = '#000';
export const Border_LightGREY_COLOR = 'red';
export const THEME_COLOR = 'pink';

// post
export const CANCEL = BASE_PATH + '/images/icons/cancel.svg';
export const POSTING_PLACEHOLDER = BASE_PATH + '/images/icons/image-icons.svg';
export const VIDEO_P_BACKGROUND =
  BASE_PATH + '/images/mobile/profile/create_post_blank_img.svg';
export const PLUS_ICONS = BASE_PATH + '/images/mobile/svg/add_post_img.svg';
export const INFO = BASE_PATH + '/images/mobile/svg/Info.svg';
export const cloudinaryLink = 'https://res.cloudinary.com/';
export const CLOSE_ICON_BLACK = BASE_PATH + '/images/icons/close-icon-black.svg';
export const CLOSE_ICON_WHITE = BASE_PATH + '/images/icons/close-icon-white.svg';
export const CLOSE_WHITE = BASE_PATH + '/images/icons/close-white.svg';

// placeholder
export const NO_POST_PLACEHOLDER_DV = BASE_PATH + '/images/mobile/placeholderImages/Post_not_found_dv.svg';
export const NO_VIDEO_POST_PLACEHOLDER =
  BASE_PATH + '/images/mobile/placeholderImages/no_video_post_found.svg';
export const NO_IMAGE_POST_PLACEHOLDER =
  BASE_PATH + '/images/mobile/placeholderImages/no_img_post_found.svg';

export const NO_DIAMOND_POST_DV = BASE_PATH + '/images/mobile/placeholderImages/no_diamond_post.svg';

export const NO_PURCHASED_POST_PLACEHOLESR =
  BASE_PATH + '/images/mobile/placeholderImages/no_purchased_post.svg';

export const NO_POST_ICON = BASE_PATH + '/images/mobile/placeholderImages/no_post.svg';
export const NO_BULK_ICON = BASE_PATH + '/images/mobile/placeholderImages/NoBulkMsg.svg';

export const NO_LIKED_POST_PLACEHOLDER =
  BASE_PATH + '/images/mobile/placeholderImages/no_liked_post.svg';
export const NO_COLLECTION_PLACEHOLDER =
  BASE_PATH + '/images/mobile/placeholderImages/no_collection.svg';

export const PAGE_NOT_FOUND = BASE_PATH + '/images/mobile/svg/not_found.svg';

// DESKTOP HOME
export const DV_HOME_ACTIVE = BASE_PATH + '/images/desktop/svg/home_active.svg';
export const DV_HOME_InACTIVE = BASE_PATH + '/images/desktop/svg/home_inactive.svg';
export const DV_SEARCH = BASE_PATH + '/images/desktop/svg/search_outline_inactive.svg';
export const DV_PROFILE = BASE_PATH + '/images/desktop/profiles/Oval1.png';
export const DV_FEATURED = BASE_PATH + '/images/desktop/featured/pro-img-1.jpg';
export const DV_FEATURED2 = BASE_PATH + '/images/desktop/featured/pro-img-2.jpg';
export const DV_PROFILE2 = BASE_PATH + '/images/desktop/profiles/Oval2.png';
export const DV_FEATURED3 = BASE_PATH + '/images/desktop/featured/pro-img-3.jpg';
export const DV_PROFILE3 = BASE_PATH + '/images/desktop/profiles/Oval3.png';
export const DV_FEATURED4 = BASE_PATH + '/images/desktop/featured/pro-img-4.jpg';
export const DV_FEATURED5 = BASE_PATH + '/images/desktop/featured/pro-img-5.jpg';
export const DV_PROFILE4 = BASE_PATH + '/images/desktop/profiles/Oval.png';
export const DV_POST1 = BASE_PATH + '/images/desktop/posts/post_1.png';
export const DV_PROFILE5 = BASE_PATH + '/images/desktop/profiles/pro2.png';
export const DV_POST2 = BASE_PATH + '/images/desktop/posts/post_2.png';
export const DV_POST3 = BASE_PATH + '/images/desktop/posts/post_3.png';
export const DV_POST4 = BASE_PATH + '/images/desktop/posts/post_4.png';

// NAVIGATION ICON WITH FILL & STROKE CURRENTCOLOR
export const DOLLAR_IMG_ICON = BASE_PATH + '/images/mobile/svg/dollar-symbol.png';
export const SHOPPING_BAG_ICON = BASE_PATH + '/images/mobile/navigation-icons/shopping-bag.svg';


// CHAT ICONS
export const THREE_DOTS = BASE_PATH + '/images/mobile/svg/more_three_dots.svg';
export const ATTACH_FILES_ICON = BASE_PATH + '/images/mobile/svg/Icon material-attach-file.svg';

// BANNER PLACEHOLDER IMAGE
export const BANNER_PLACEHOLDER_IMAGE = BASE_PATH + '/images/mobile/svg/bannerPlaceholderImage.svg';
export const COLLECTION_BANNER_PLACEHOLDER_IMAGE = BASE_PATH + '/images/mobile/svg/collection_place_holder.svg';
export const BANNER_PLACEHOLDER_IMAGE_COVER = BASE_PATH + '/images/dv-placeholder.svg';

// thumb
export const THUMB_CREATION = BASE_PATH + '/images/mobile/svg/thum-check.svg';

// DESKTOP CHAT
export const DV_CHAT_PROFILE = BASE_PATH + '/images/desktop/chats/chat_profile.png';
export const DV_CHAT_ICON = BASE_PATH + '/images/desktop/icons/info.svg';
export const DV_CHAT = BASE_PATH + '/images/desktop/chats/chat2.png';
export const DV_CHAT3 = BASE_PATH + '/images/desktop/chats/chat3.png';
export const DV_CHECK = BASE_PATH + '/images/desktop/icons/check.svg';
export const PROFILE_CHAT_ICON = BASE_PATH + '/images/desktop/icons/new_chat_icon.svg';
export const INFO_OUTLINE = BASE_PATH + '/images/icons/info_outline.svg';
export const SHARE_OUTLINE_PROFILE = BASE_PATH + '/images/icons/share_outline_profile.svg';
export const SHARE_OUTLINE_PROFILE_DARKTHEME = BASE_PATH + '/images/icons/share_outline_profile_darktheme.svg';
export const INFO_OUTLINE_DARKTHEME = BASE_PATH + '/images/icons/info_outline_darktheme.svg';
// DESKTOP PROFILE
export const DV_RECTANGLE = BASE_PATH + '/images/desktop/profiles/Rectangle.png';
export const PROFILE_ICON_OUTLINE = BASE_PATH + '/images/profile_images/icons/user_plus_icon.svg'


export const DV_CHAT_INACTIVE_ICON =
  BASE_PATH + '/images/profile_images/icons/dv-chat-inactive.svg';
export const DV_PROFILE_INACTIVE_ICON =
  BASE_PATH + '/images/profile_images/icons/dv-profile-inactive.svg';

// STATUS PAGE
export const RIGHT_WHT_ARROW = BASE_PATH + '/images/mobile/svg/right-arrow_wht.svg';
export const SEND_ICON = BASE_PATH + '/images/mobile/svg/send.svg';

// POST SLIDER
export const CROSS_ICON_POSTSLIDER = BASE_PATH + '/images/icons/cross_icon_postslider.svg'
export const PREV_ARROW_POSTSLIDER = BASE_PATH + '/images/icons/prev_arrow_postslider.svg'
export const NEXT_ARROW_POSTSLIDER = BASE_PATH + '/images/icons/next_arrow_postslider.svg'



// NAV MENU PAGE
export const Help_Center_Icon = BASE_PATH + '/images/mobile/nav-menu/help-center.svg';
export const Deactivate_Icon = BASE_PATH + '/images/mobile/nav-menu/deactivate.svg';
export const Right_Chevron_Icon = BASE_PATH + '/images/icons/right-arrow-angle.svg';
export const cross_icon_input = BASE_PATH + '/images/icons/cross_icon_input.svg';
export const No_Card_Found =
  BASE_PATH + '/images/mobile/placeholderImages/no_card_found.svg';
export const No_Address =
  BASE_PATH + '/images/mobile/placeholderImages/map-placeholder.svg';
export const Placeholder_PROFILE_IMG =
  BASE_PATH + '/images/mobile/nav-menu/placeholder_pp.svg';

export const CONTACT_US_ICON = BASE_PATH + '/images/mobile/nav-menu/contactus.svg';

// profile
export const DIAMOND = BASE_PATH + '/images/mobile/svg/diamond.svg';

// wallet
export const Withdraw_Methods_Icon =
  BASE_PATH + '/images/mobile/nav-menu/withdraw_methods_icon.svg';
export const Paypal_Icon = BASE_PATH + '/images/mobile/nav-menu/paypal_icon.svg';
export const Warning_Icon = BASE_PATH + '/images/mobile/nav-menu/warning_icon.svg';
export const Stripe_Account = BASE_PATH + '/images/mobile/nav-menu/stripe_account.svg';
export const Right_Chevron_Base = BASE_PATH + '/images/icons/right-arrow-angle-baseClr.svg';
export const sendMessageIcon = BASE_PATH + '/images/go_live_screen/arrowcircleright.svg'
export const No_Bank_Acc = BASE_PATH + '/images/mobile/placeholderImages/no_bank_acc.svg';
export const Verified_Icon = BASE_PATH + '/images/mobile/nav-menu/verified_icon.svg';
export const Powered_By_Google_Icon =
  BASE_PATH + '/images/mobile/nav-menu/powered_by_google_on_white.png';
export const Camera_Icon = BASE_PATH + '/images/mobile/nav-menu/camera_icon.svg';

// Chat Color Code
export const LIGHT_GRAY = '#7d7f86';
export const LIGHTGRAYCHAT = '#9da1a3';
export const BACKGROUND_COLOR = '#f5f5f9';
export const LITE_BACKGROUND_COLOR = '#9ad8f1';
export const PDP_BUTTON_BORDER = '#011f3f';
export const PRIMARY = process.env.NEXT_PUBLIC_PRIMARY_COLOR;
export const BASE_COLOR = process.env.NEXT_PUBLIC_PRIMARY_COLOR;
export const WHITE = '#fff';
export const color1 = ' #011f3f';
export const color3 = '#8b9591';
export const color2 = '#4f5266';
export const color4 = '#dfdfdf';
export const color5 = '#00000029';
export const color6 = '#c9eefe';
export const color7 = ' #cccccc';
export const color8 = ' #f8f8f8';
export const color9 = ' #efefef';
export const color10 = '#d3d3d3';
export const color11 = '#7B7B7B';
export const color12 = '#777777';
export const color13 = '#F3F3F3';
export const color14 = '#DDDDDD';
export const color15 = '#D3E2EF';
export const color16 = '#F0F0F0';
export const color17 = '#4A3B3B';
export const color18 = '#838485';
export const color19 = '#49ABF33B';
export const color20 = '#9A9A9A';
export const color21 = '#333333';
export const color22 = '#484848';
export const color23 = '#D9EFFF';
export const color24 = '#011F3FD1';
export const INPUT_BORDER = '#dfdfdf';
export const LIGHT_BLUE = '#c9eefe';
export const RED = '#ff0000';

// chat messages

export const ERROR = BASE_PATH + '/images/chat/error-icon.png';
export const CHAT_SEND = BASE_PATH + '/images/chat/send-button.svg';
export const PLAY_BUTTON = BASE_PATH + '/images/chat/play-button.svg';
export const CHAT_MENU = BASE_PATH + '/images/chat/menu.svg';
export const CHAT_SEND_BTN = BASE_PATH + '/images/chat/send-btn.svg';
export const CHAT_IMAGE = BASE_PATH + '/images/chat/image.svg';
export const CHAT_FILE = BASE_PATH + '/images/chat/File.svg';
export const CHAT_CLIP = BASE_PATH + '/images/chat/clip.svg';
export const CHAT_LOCATION = BASE_PATH + '/images/chat/location.png';
export const CHAT_INFO = BASE_PATH + '/images/chat/information.svg';
export const CLOSE_INPUT = BASE_PATH + '/images/chat/close-input.png';
export const CHAT_DOWNLOAD = BASE_PATH + '/images/chat/download.svg';
export const CHAT_XLS = BASE_PATH + '/images/chat/xls.svg';
export const CHAT_DOC = BASE_PATH + '/images/chat/doc.svg';
export const CHAT_TXT = BASE_PATH + '/images/chat/txt.svg';
export const CHAT_PDF = BASE_PATH + '/images/chat/pdf.svg';
export const DEFAULT_DOC = BASE_PATH + '/images/chat/default-doc.png';
export const INPUT_CLOSE_BUTTON = BASE_PATH + '/images/chat/close-input.png';
export const CHAT_PLAY = BASE_PATH + '/images/chat/play.svg';
export const CHAT_PLACEHOLDER = BASE_PATH + '/images/chat/chat.png';
export const PLAY_2 = BASE_PATH + "/images/chat/play.svg"
export const EXCHANGE_ICON = BASE_PATH + '/images/chat/exchange-icon.svg';
export const RECENT_SEARCH_ICON = BASE_PATH + '/static/images/history.svg';
export const CHAT_BEEP = '/static/sound/message_bip.mp3';
export const CHAT_MESSAGE_BEEP = '/static/sound/msg_cam.mp3';

export const IMOGI = BASE_PATH + '/images/chat/smily.svg';
export const PLACE_HOLDER = BASE_PATH + '/images/chat/webplaceholoder.png';
export const LIVE = BASE_PATH + '/images/live.png';
export const SOLD = BASE_PATH + '/images/product/sold.png';

export const PROFILE_IMAGE = BASE_PATH + '/images/1.jpg';
export const SEDAN_CAR = BASE_PATH + '/images/sedan_car_front.png';
export const DIALOG_CLOSE1 = BASE_PATH + '/images/chat/close-button.svg';
// payment screen
export const next_arch = BASE_PATH + '/images/mobile/payment/next_anch.svg';
export const p_down_arrow = BASE_PATH + '/images/mobile/payment/down-arrow.svg';


// follow following placeholder
export const FOLLOW_FOLLOWING = BASE_PATH + '/images/icons/follow-following.svg';
export const WITHDRAWAL_TRIGGER = {
  'PRODUCT PURCHASE': 1,
  'PENDING AMOUNT': 2,
  'WALLET RECHARGE': 3,
  'PLAN PURCHASE': 4,
  'CREDIT PENDING AMOUNT': 5,
  'DEBIT PENDING AMOUNT': 6,
  'WITHDRAW REQUEST': 7,
  'TRANSFER': 8,
  'REFUND PENDING AMOUNT': 9,
  'CANCEL DEAL': 10,
  'WITHDRAW': 11,
  'DAILY_POOL': 12,
};

// payment confirm dialog
export const EDIT_COLORED = BASE_PATH + '/images/icons/edit-colored.svg';
export const MAP_LOCATION = BASE_PATH + '/images/icons/map-pointer.svg';
export const CARD_ICON = BASE_PATH + '/images/icons/credit-card.svg';

// collection
export const DOCUMENT_PLACEHOLDER = BASE_PATH + '/images/icons/document-placeholder.svg';
export const DV_DOCUMENT_PLACEHOLDER = BASE_PATH + '/images/icons/dev-collection.png';
export const DV_DOCUMENT_PLACEHOLDER_DARK = BASE_PATH + '/images/icons/dev-collection-dark.png';
export const DV_COLLECTION_PLACEHOLDER = BASE_PATH + '/images/icons/collection-placeholder.png';

export const COLLECTION_PLACEHOLDER =
  BASE_PATH + '/images/icons/collection-placerholder-xl.svg';

export const COLLECTION_POST_PLACEHOLDER =
  BASE_PATH + '/images/icons/collection-post-placeholder.svg';
export const COLLECTION_COVER_PLACEHOLDER =
  BASE_PATH + '/images/icons/collection-cover-placeholder.svg';
export const DARK_COLLECTION_COVER_PLACEHOLDER =
  BASE_PATH + '/images/icons/dark_collection-cover-placeholder.svg';

export const FLOATING_PLUS_BUTTON = BASE_PATH + '/images/icons/floating_plus.svg';
export const BOOKMARKED = BASE_PATH + '/images/icons/bookmark_marked.svg';
// follow following
// export const FOLLOW_PLACEHOLDER = BASE_PATH + "/images/follow-following.svg";

// comment icons
export const COMMENT_PLACEHOLDER_IMAGE =
  BASE_PATH + '/images/icons/comment-placeholder.svg';

export const RADIO_CHECKED = BASE_PATH + '/images/icons/radio-checked.svg';


export const Down_Arrow_Blue = BASE_PATH + '/images/mobile/svg/down-arrow-blue.svg';
export const Down_Arrow_White = BASE_PATH + '/images/mobile/svg/down-arrow-white.svg';

export const ImageVideoIcons = BASE_PATH + '/images/icons/video-icon.svg';

// billing_and_plans icons
export const Subscription_Star = BASE_PATH + '/images/mobile/svg/subscription_star.svg';
export const Selective_BP_White = BASE_PATH + '/images/mobile/svg/selective_bp_white.svg';
export const Selective_BP_Blue = BASE_PATH + '/images/mobile/svg/selective_bp_blue.svg';
export const Subscription_Plan = BASE_PATH + '/images/icons/subscription_plan.svg';
export const Tip_Plan = BASE_PATH + '/images/icons/tip_plan.svg';
export const Vip_Plan = BASE_PATH + '/images/icons/vip_plan.svg';

// desktop icons
export const Chat_ICON_Blue = BASE_PATH + '/images/desktop/icons/dv_chat_blue.svg';
export const Chat_ICON_White = BASE_PATH + '/images/desktop/icons/dv_chat_white.svg';
export const PROFILE_Black = BASE_PATH + '/images/desktop/icons/profile-black.svg';
export const PURCHASE_POST_White = BASE_PATH + '/images/desktop/svg/purchased_post.svg';
export const PROFILE_Blue = BASE_PATH + '/images/desktop/icons/profile-blue.svg';
export const DV_Share_Icon = BASE_PATH + '/images/desktop/icons/share_icon.svg';
export const Chevron_Left = BASE_PATH + '/images/desktop/icons/chevron_left.svg';
export const DV_Reload_Icon = BASE_PATH + '/images/desktop/icons/reload_icon.svg';
export const EDIT_GREY = BASE_PATH + '/images/icons/edit-grey.svg';
export const CANCEL_GREY = BASE_PATH + '/images/icons/cancel_grey.svg';
export const DASHBOARD_ICON_WHITE =
  BASE_PATH + '/images/desktop/icons/dashboard_icon_white.svg';
export const DASHBOARD_ICON_Blue =
  BASE_PATH + '/images/desktop/icons/dashboard_icon_blue.svg';
export const EXPLORE_ICON_Inactive = BASE_PATH + '/images/desktop/icons/explore_white.svg';
export const POSTING_ICON_WHITE = BASE_PATH + '/images/desktop/icons/posting-white.svg';
export const SHARE_ICON_Dark = BASE_PATH + '/images/desktop/icons/share_icon_darkGrey.svg';
export const DISLIKE_ICON_Dark = BASE_PATH + '/images/desktop/icons/unLike_darkGrey.svg';
export const BOOKMARK_ICON_Dark = BASE_PATH + '/images/desktop/icons/Bookmark_darkGrey.svg';







// image and video type
export const IMAGE_TYPE =
  'image/x-png, image/png, image/jpeg, image/gif, image/jpg, image/svg, image/ico';

// notification placeholder
export const NOTIFICATION_PLACEHOLDER =
  BASE_PATH + '/images/icons/notification-placeholder.svg';

// refer your friend
export const Refer_Frens_Placeholder =
  BASE_PATH + '/images/mobile/placeholderImages/refer_frenz_placeholder.svg';

// user profile
export const Collections_Inactive =
  BASE_PATH + '/images/mobile/profile/collections_inactive.svg';
export const Chevron_Right_Darkgrey =
  BASE_PATH + '/images/desktop/icons/chevron_right_darkgrey.svg';
export const backArrow_lightgrey = BASE_PATH + '/images/icons/back-arrow-lightgrey.svg';
export const PROFILE_SHARE_ICON = BASE_PATH + "/images/icons/share.svg";
export const PROFILE_SHARE_ICON_OUTLINE = BASE_PATH + "/images/icons/share_outline.svg";

export const dummy_pp = BASE_PATH + '/images/mobile/profile/edit_profile_img.svg';
export const Right_Chevron_Icon_Grey =
  BASE_PATH + '/images/icons/right-arrow-angle-grey.svg';

export const collection_icon_white =
  BASE_PATH + '/images/mobile/profile/collection-icon_white.svg';
export const google_icon = BASE_PATH + '/images/mobile/profile/google.svg';
export const Delete_Grey = BASE_PATH + '/images/desktop/icons/delete_grey.svg';
export const Edit_Blue = BASE_PATH + '/images/desktop/icons/edit_blue.svg';
export const Collections_Grey = BASE_PATH + '/images/mobile/profile/collections_grey.svg';

export const INSIGHT_BLACK = BASE_PATH + '/images/icons/insight_black.svg';
export const DV_Camera_Icon = BASE_PATH + '/images/icons/camera_icon.svg';
export const DV_Bank_Icon = BASE_PATH + '/images/icons/bank.svg';
export const Delete_Red = BASE_PATH + '/images/desktop/icons/delete_red.svg';
export const No_Blocked_User = BASE_PATH + '/images/icons/no_blocked_user.svg';
export const DV_Purchase_Post = BASE_PATH + '/images/desktop/icons/purchase_post.svg';
export const DV_Insight = BASE_PATH + '/images/desktop/icons/dv_insight.svg';
export const DV_Insight_White = BASE_PATH + '/images/desktop/icons/dv_insight_white.svg';
export const No_Billing = BASE_PATH + '/images/desktop/icons/no_billing.svg';
export const DV_Share_Icon_Lightgrey =
  BASE_PATH + '/images/desktop/icons/share_icon_lightgrey.svg';
export const WHITE_MY_SUBSCRIPTION_SVG =
  BASE_PATH + '/images/desktop/svg/mySubscriptions.svg';
export const WHITE_MY_SUBSCRIBERS_SVG = BASE_PATH + '/images/desktop/svg/mySubscribers.svg';
export const SUBSCRIPTION_PLACEHOLDER_SVG =
  BASE_PATH + '/images/mobile/svg/subscription-placeholder.svg';

export const WHITE_SETTINGS_SVG = BASE_PATH + '/images/desktop/svg/settings.svg';





export const Add_HomeScreen = BASE_PATH + '/images/icons/plus_icon.svg';

export const Dark_moon = BASE_PATH + '/images/Mask Group 328.svg';
export const NONE_ICON =
  BASE_PATH + '/images/icons/none-icon.svg';
export const HIGHLIGHTED_NONE_ICON =
  BASE_PATH + '/images/icons/highlighted-none.svg';
export const CATEGORY_OUTLINE_ICON = BASE_PATH + '/images/icons/category_outline_icon.svg';

export const VISA = BASE_PATH + '/images/mobile/svg/visa.svg';
export const MASTER_CARD = BASE_PATH + '/images/mobile/svg/masterCard.svg';

// Shoutouet web
export const FANZLY_ACTIVE = BASE_PATH + '/images/shoutout_web/fanzly_enable.svg';
export const FANZLY_DEACTIVE = BASE_PATH + '/images/shoutout_web/fanzly_disable.svg';
export const GIFT_ACTIVE = BASE_PATH + '/images/shoutout_web/gift_enable.svg';
export const GIFT_DEACTIVE = BASE_PATH + '/images/shoutout_web/gift_disable.svg';
export const ROLE_ACTIVE = BASE_PATH + '/images/shoutout_web/role_active.svg';
export const ROLE_DEACTIVE = BASE_PATH + '/images/shoutout_web/role.svg';
export const CLOSE_ICON_WHITE_IMG = BASE_PATH + '/images/mobile/svg/ICON/close.svg';
export const MORE_ICON_WHITE_IMG = BASE_PATH + '/images/mobile/svg/ICON/more-white.png';
export const SHARE_IMG = BASE_PATH + '/images/mobile/svg/ICON/share.svg';
export const LIKE_INACTIVE_IMG = BASE_PATH + '/images/mobile/svg/ICON/Group 56205.svg';
export const GIFT_IMG = BASE_PATH + '/images/mobile/svg/ICON/Group 56106.svg';
export const PAID_IMG = BASE_PATH + '/images/mobile/svg/ICON/Group 56206.svg';
export const PAYMENT_IMG = BASE_PATH + '/images/mobile/svg/ICON/payment-currency.svg';
export const LEFT_ACTIVE = BASE_PATH + '/images/shoutout_web/left_active.svg';
export const LEFT_INACTIVE = BASE_PATH + '/images/shoutout_web/left_inactive.svg';
export const RIGHT_ACTIVE = BASE_PATH + '/images/shoutout_web/right_active.svg';
export const RIGHT_INACTIVE = BASE_PATH + '/images/shoutout_web/right_inactive.svg';
export const TICK_MARK = BASE_PATH + '/images/shoutout_web/tick-4.svg';


export const VIDEO_GO_PUBLIC = BASE_PATH + '/images/mobile/svg/Group 40854.svg';
export const SCHDULE_IMG = BASE_PATH + '/images/mobile/svg/Group 40856.svg';
export const UPLOAD_DEFAULT_IMG = BASE_PATH + '/images/mobile/svg/Group 56257.svg';

export const PLUS__IMG__BLACK = BASE_PATH + '/images/mobile/svg/plus.png';
export const PACKAGING = BASE_PATH + '/images/mobile/svg/packaging.png';
export const White_sunny = BASE_PATH + '/images/white-balance-sunny.svg';
export const NO_ORDER_PLACEHOLDER = BASE_PATH + '/images/shoutout_web/no_order_placeholder.svg';

export const COLOR_PALATTE = BASE_PATH + '/images/icons/color-palatte.svg';
export const TEXT_SHAPE = BASE_PATH + '/images/icons/text-shape.svg';
export const FOLLOW_HASHTAG = BASE_PATH + '/images/desktop/svg/hashtag.svg';

export const welcome_txt_color = '#504f4f';

export const report_img_picker = BASE_PATH + '/images/mobile/placeholderImages/report_img_picker.svg';

// new UI assets of other user profile
export const video_post_icon = BASE_PATH + '/images/otherUser_profile_assests/Icon material-ondemand-video.svg';
export const post_icon = BASE_PATH + '/images/otherUser_profile_assests/post_icon.svg';
export const image_post_icon = BASE_PATH + '/images/otherUser_profile_assests/image_post.svg';
export const exclusive_post_icon = BASE_PATH + '/images/otherUser_profile_assests/diamond_icon.svg';

export const TICK = BASE_PATH + '/images/icons/ticks-icon.svg';
export const NO_FEATURE_CREATORE_HOLDER = BASE_PATH + '/images/mobile/placeholderImages/no creator.svg';
export const IMAGE_POST = BASE_PATH + '/images/mobile/image_post.svg';
export const IMAGE_POST_ACTIVE = BASE_PATH + '/images/mobile/image_post_active.svg';
export const LOCKED_POST = BASE_PATH + '/images/mobile/locked_post.svg';
export const LOCKED_POST_ACTIVE = BASE_PATH + '/images/mobile/locked_post_active.svg';
export const TEXT_POST = BASE_PATH + '/images/mobile/text_post.svg';
export const TEXT_POST_ACTIVE = BASE_PATH + '/images/mobile/text_post_active.svg';
export const CALENDER = BASE_PATH + '/images/mobile/calender.svg';
export const EYE = BASE_PATH + '/images/mobile/eye.svg';
export const PEOPLE = BASE_PATH + '/images/mobile/people.svg';
// BULK MESSAGE DESKTOP ICON
export const IMAGE_POST_DESKTOP = BASE_PATH + '/images/desktop/bulkMessage/svg/image.svg';
export const IMAGE_POST_ACTIVE_DESKTOP = BASE_PATH + '/images/desktop/bulkMessage/svg/image-1.svg';
export const TEXT_POST_DESKTOP = BASE_PATH + '/images/desktop/bulkMessage/svg/text.svg';
export const TEXT_POST_ACTIVE_DESKTOP = BASE_PATH + '/images/desktop/bulkMessage/svg/text-1.svg';
export const LOCKED_POST_DESKTOP = BASE_PATH + '/images/desktop/bulkMessage/svg/lockedPost.svg';
export const LOCKED_POST_ACTIVE_DESKTOP = BASE_PATH + '/images/desktop/bulkMessage/svg/lockedPost-1.svg';



export const playIcon = BASE_PATH + '/images/shoutout_web/playIcon.svg';


export const facebook_social = BASE_PATH + '/images/desktop/socialMediaImages/facebook.svg';
export const youtube_social = BASE_PATH + '/images/desktop/socialMediaImages/youtube.svg';
export const instagram_social = BASE_PATH + '/images/desktop/socialMediaImages/instagram.svg';
export const twitter_social = BASE_PATH + '/images/desktop/socialMediaImages/twitter.svg';
export const onlyfans_social = BASE_PATH + '/images/desktop/socialMediaImages/onlyfans.svg';
export const snapchat_social = BASE_PATH + '/images/desktop/socialMediaImages/snapchat.svg';

export const facebook_social_disble = BASE_PATH + '/images/desktop/socialMediaImages/social_facebook_disable.svg';
export const youtube_social_disble = BASE_PATH + '/images/desktop/socialMediaImages/social_youtube_disable.svg';
export const instagram_social_disble = BASE_PATH + '/images/desktop/socialMediaImages/social_instagram_disable.svg';
export const twitter_social_disble = BASE_PATH + '/images/desktop/socialMediaImages/social_twitter_disable.svg';
export const onlyfans_social_disble = BASE_PATH + '/images/desktop/socialMediaImages/soical_onlyfans_disable.svg';
export const snapchat_social_disble = BASE_PATH + '/images/desktop/socialMediaImages/soical_snapchat_disable.svg';
export const snapchat_social_white_disble = BASE_PATH + '/images/desktop/socialMediaImages/soical_snapchat_white_disable.svg';

export const TEXT_PLACEHOLDER = BASE_PATH + '/images/text_placeholder.png';
export const SIGNUP1 = BASE_PATH + '/images/bg/signup1.png';
export const SIGNUP2 = BASE_PATH + '/images/bg/signup2.png';
export const SIGNUP3 = BASE_PATH + '/images/bg/signup3.png';

export const sharpCornerIconLight = BASE_PATH + '/images/icons/polygonLight.svg';
export const sharpCornerIconDark = BASE_PATH + '/images/icons/polygonDark.svg'


export const INFO_ICON = BASE_PATH + '/images/icons/INFO.svg';
export const leftSideIcon = BASE_PATH + '/images/icons/leftSideIcon.svg';
export const leftSideIconWhite = BASE_PATH + '/images/icons/leftSideIconWhite.svg';
export const rightSideIcon = BASE_PATH + '/images/icons/rightSideIcon.svg';
export const rightSideIconWhite = BASE_PATH + '/images/icons/rightSideIconWhite.svg';
export const shotoutTabActive_icon = BASE_PATH + '/images/shoutout_web/shotuoutTab_active.svg';

export const TIP_ICON_OTHERPROFIE = BASE_PATH + '/images/icons/tipIcon.svg';

export const MULTI_IMG_SVG = BASE_PATH + '/images/multiImage.svg';
export const Next_Arrow_Story = BASE_PATH + '/images/icons/Next_Arrow_Story.svg';
export const Prev_Arrow_Story = BASE_PATH + '/images/icons/Prev_Arrow_Story.svg';



// dummy images for markate place landing page
export const live_user1 = BASE_PATH + '/images/markate-place-page/Group -1.png';
export const live_user2 = BASE_PATH + '/images/markate-place-page/Group -2.png';
export const live_user3 = BASE_PATH + '/images/markate-place-page/Group -3.png';
export const live_user4 = BASE_PATH + '/images/markate-place-page/Group -4.png';
export const live_user5 = BASE_PATH + '/images/markate-place-page/Group -5.png';
export const live_user6 = BASE_PATH + '/images/markate-place-page/Group -6.png';
export const live_user7 = BASE_PATH + '/images/markate-place-page/Group -7.png';
export const live_user8 = BASE_PATH + '/images/markate-place-page/Group -8.png';
export const live_user9 = BASE_PATH + '/images/markate-place-page/Group -9.png';
export const live_user10 = BASE_PATH + '/images/markate-place-page/Group -10.png';
export const live_user11 = BASE_PATH + '/images/markate-place-page/Group -11.png';
export const user_story1 = BASE_PATH + '/images/markate-place-page/userstory1.png';

export const appleFooterIcon = BASE_PATH + '/images/markate-place-page/Icon awesome-apple.svg';
export const facebookFooterIcon = BASE_PATH + '/images/markate-place-page/Icon awesome-facebook-f.svg';
export const twitterFooterIcon = BASE_PATH + '/images/markate-place-page/Icon awesome-twitter.svg';
export const mailFooterIcon = BASE_PATH + '/images/markate-place-page/Icon material-mail.svg';
export const instaFooterIcon = BASE_PATH + '/images/markate-place-page/Icon awesome-instagram.svg';
export const shoutoutIcon = BASE_PATH + '/images/mobile/svg/shoutoutIcon.svg';

// Video Call Icons
export const schedulePlacholderIcon = BASE_PATH + "/images/video_call_assets/schedule_icon.svg";
export const editScheduleIcon = BASE_PATH + "/images/video_call_assets/Vector.svg";

// MARKATE PLACE FOOTER PART
export const facebook_footer_icon = BASE_PATH + '/images/webFooter/facebook.svg';
export const instagram_footer_icon = BASE_PATH + '/images/webFooter/instagram.svg';
export const linkedin_footer_icon = BASE_PATH + '/images/webFooter/linked in.svg';
export const twitter_footer_icon = BASE_PATH + '/images/webFooter/twitter.svg';
export const youtube_footer_icon = BASE_PATH + '/images/webFooter/youtube.svg';

// About Us Banner/Images
export const ABOUT_US_BANNER = BASE_PATH + '/images/aboutus/aboutBanner.png';
export const DARIA_REM = BASE_PATH + '/images/aboutus/dariaRem.png';
export const FERNINAND = BASE_PATH + '/images/aboutus/ferninand.png';

export const right_slick_arrow = BASE_PATH + "/images/icons/rightSlickArrow.svg";
export const left_slick_arrow = BASE_PATH + "/images/icons/leftSlickArrow.svg";

export const right_slick_arrow_dark = BASE_PATH + "/images/icons/rightSlickDarkArrow.svg";
export const left_slick_arrow_dark = BASE_PATH + "/images/icons/leftSlickDarkArrow.svg";
export const footer_app_logo = BASE_PATH + "/images/icons/fanzly_white_logo.svg";
// Contact us icon
export const CONTACT_US_BANNER = BASE_PATH + '/images/desktop/Contactus/contactusBanner.png';

// shoutout detail page assets
// shoutout section on homepage
export const section1Icon = BASE_PATH + "/images/markate-place-page/shoutoutSection/section1.svg";
export const section2Icon = BASE_PATH + "/images/markate-place-page/shoutoutSection/section2.svg";
export const section3Icon = BASE_PATH + "/images/markate-place-page/shoutoutSection/section3.svg";
export const section4Icon = BASE_PATH + "/images/markate-place-page/shoutoutSection/section4.svg";
export const requestBooking = BASE_PATH + "/images/markate-place-page/shoutoutSection/requestBooking.svg";
export const funBegins = BASE_PATH + "/images/markate-place-page/shoutoutSection/funBegins.svg";
export const processIcon = BASE_PATH + "/images/markate-place-page/shoutoutSection/processIcon.svg";
export const walletSection = BASE_PATH + "/images/markate-place-page/shoutoutSection/walletSection.svg";

// about page assets
export const main = BASE_PATH + "/images/aboutPage/main.svg";
export const grid1 = BASE_PATH + "/images/aboutPage/grid1.svg";
export const grid3 = BASE_PATH + "/images/aboutPage/grid3.svg";
export const grid2 = BASE_PATH + "/images/aboutPage/grid2.svg";
export const one = BASE_PATH + "/images/aboutPage/one.png";
export const two = BASE_PATH + "/images/aboutPage/two.png";
export const facebook = BASE_PATH + "/images/aboutPage/facebook.png";
export const twitter = BASE_PATH + "/images/aboutPage/twitter.png";
export const instagram = BASE_PATH + "/images/aboutPage/gram.png";
export const apple = BASE_PATH + "/images/aboutPage/111.png";
export const email = BASE_PATH + "/images/aboutPage/222.png";
export const three = BASE_PATH + "/images/aboutPage/three.png";
export const thunder = BASE_PATH + "/images/aboutPage/thunder.png";
export const global = BASE_PATH + "/images/aboutPage/global.png";
export const check = BASE_PATH + "/images/aboutPage/check.png";
export const live = BASE_PATH + "/images/aboutPage/live.png";

export const section1AboutLight = BASE_PATH + "/images/aboutPage/section1Light.png";
export const section2AboutLight = BASE_PATH + "/images/aboutPage/section2Light.png";
export const section3AboutLight = BASE_PATH + "/images/aboutPage/section3Light.png";
export const section3AboutDark = BASE_PATH + "/images/aboutPage/section3Dark.png";
export const section4AboutLight = BASE_PATH + "/images/aboutPage/section4Light.png";
export const section5AboutLight = BASE_PATH + "/images/aboutPage/section5Light.png";
export const section6AboutLight = BASE_PATH + "/images/aboutPage/section6Light.png";





export const autoMessageplaceholder = BASE_PATH + "/images/icons/autoMesagePlaceholder.svg";
export const userIconSvg = BASE_PATH + "/images/icons/userIcon.svg";

export const passwordRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$-/:-?{-~!"^_`\[\]])[A-Za-z0-9@#$-/:-?{-~!"^_`\[\]]{6,}$/



// all Icon
export const VIDEO_CALL_ICON = BASE_PATH + '/images/chat/video-call-icon.svg';
export const EMPTY_CHAT_PLACEHOLDER = BASE_PATH + '/images/icons/chat.svg';
export const UP_MENU = BASE_PATH + '/images/chat/menu.svg';
export const ATTECHMENT = BASE_PATH + '/images/chat/attachment.svg';
export const CHAT_GALLERY = BASE_PATH + '/images/chat/gallery.svg';
export const CHAT_VIDEO = BASE_PATH + '/images/chat/video.svg';
export const CHAT_DOCUMENT = BASE_PATH + '/images/chat/document.svg';
export const QR_CODE = BASE_PATH + '/images/chat/qrcode.svg';
export const CHAT_CAMERA_ICON = BASE_PATH + '/images/chat/chat-camera-icon.svg';
export const backArrow = BASE_PATH + '/images/icons/back-arrow.svg';
export const SEND_REVIEW = BASE_PATH + '/images/chat/send-review.svg';
export const MORE_ICON = BASE_PATH + '/images/icons/more.svg';
export const IMAGE_LOCK_ICON = BASE_PATH + '/images/icons/lock-icon.svg';
export const P_CLOSE_ICONS = BASE_PATH + '/images/icons/close-icon.svg';
export const EDIT_SVG = BASE_PATH + '/images/icons/edit.svg';
export const DELETE_SVG = BASE_PATH + '/images/icons/delete.svg';
export const crmCloseIcon = BASE_PATH + "/images/icons/crmCloseIcon.svg";
export const Bank_Icon_card = BASE_PATH + '/images/mobile/payment/bank-account.svg';
export const MENU_ICON = BASE_PATH + '/images/icons/menu-icon.svg';
export const COLLECTION_CHECKED = BASE_PATH + '/images/icons/Tick.svg';
export const COLLECTION_PLUS = BASE_PATH + '/images/icons/new-plus.svg';
export const DV_NEW_PLACEHOLDER = BASE_PATH + '/images/icons/new-collection.svg';
export const DV_NEW_PLACEHOLDER_DARK = BASE_PATH + '/images/icons/new-collection-dark.svg';
export const CHECK = BASE_PATH + '/images/check.svg';
export const UNCHECK = BASE_PATH + '/images/uncheck.svg';
export const MOBILE_NAV_BACK2 = BASE_PATH + '/images/icons/back-arrow.svg';
export const Report_Problem_Icon = BASE_PATH + '/images/mobile/nav-menu/report-problem.svg';
export const Language_Icon = BASE_PATH + '/images/mobile/nav-menu/language.svg';
export const FAQs_Icon = BASE_PATH + '/images/mobile/nav-menu/faqs.svg';
export const SEACH_WHITE = BASE_PATH + '/images/mobile/svg/search-white.svg';
export const shoutoutBackBtn = BASE_PATH + "/images/markate-place-page/shoutoutBackBtn.svg";
export const shoutoutMoreBtn = BASE_PATH + "/images/markate-place-page/shoutoutMoreBtn.svg";
export const shoutoutPlayBtn = BASE_PATH + "/images/markate-place-page/shoutoutVideoPlayBtn.svg";
export const shoutoutShareBtn = BASE_PATH + "/images/markate-place-page/shoutoutShareBtn.svg";
export const Refer_Friends_Icon = BASE_PATH + '/images/mobile/nav-menu/refer-friends.svg';
export const MY_ORDER_SVG = BASE_PATH + '/images/mobile/svg/order.svg';
export const COLLECTION_OUTLINE_ICON = BASE_PATH + '/images/icons/collection_outline_icon.svg';
export const HEART_ICON = BASE_PATH + '/images/mobile/navigation-icons/like.svg';
export const About_Us_Icon = BASE_PATH + '/images/mobile/nav-menu/aboutus.svg';
export const creator_tool_icon = BASE_PATH + '/images/desktop/icons/creator_tool.svg';
export const MANAGE_LIST = BASE_PATH + '/images/mobile/nav-menu/manage-list.svg';
export const CONTACTUS_ICON = BASE_PATH + '/images/desktop/icons/contact.svg';

export const reviewTabIcon = BASE_PATH + "/images/icons/reviewTab.svg";
export const Logout_Icon_Black = BASE_PATH + '/images/desktop/icons/logout-black.svg';
export const Creator_Icon = BASE_PATH + '/images/mobile/svg/creator_icon.svg';

export const NO_TRANSACTIONS_IMG = BASE_PATH + '/images/mobile/placeholderImages/no_transactions_found.svg';
export const Bank_Icon = BASE_PATH + '/images/mobile/nav-menu/bank_icon.svg';
export const DOLLAR_ICON = BASE_PATH + '/images/mobile/time line icons/Dollar_tip.svg';
export const DOLLAR_ICON_OUTLINE = BASE_PATH + '/images/profile_images/icons/new_dollar_icon.svg';
export const DOLLAR_ICON_GRADIENT = BASE_PATH + '/images/icons/dollarGradient.svg';
export const OUTLINE_CIRCLE = BASE_PATH + '/images/chat/outline_circle.svg';
export const CHECKED_CIRCLE = BASE_PATH + '/images/chat/checked_circle.svg';
export const NO_USER_DATA = BASE_PATH + '/images/icons/noData.svg';
export const downArrowIcons = BASE_PATH + '/images/icons/Icon feather-chevron-right.svg';
export const DOLLAR_BULK_MESSAGE = BASE_PATH + '/images/mobile/dollar.svg';
export const NO_RECENT_SEARCH = BASE_PATH + '/images/icons/no-recent-search.svg';
export const NO_HASHTAG = BASE_PATH + '/images/icons/hashtag.svg';
export const DOWN_ARROW_PRIMARY = BASE_PATH + '/images/mobile/payment/down-arrow-primary.svg';
export const ratingIcon = BASE_PATH + "/images/icons/ratingIcon.svg";
export const shoutoutForFriend = BASE_PATH + '/images/shoutout_web/shoutoutForFriend.svg';
export const NO_SUBSCRIBERS_PLACEHOLDER_SVG = BASE_PATH + '/images/icons/no-subscribers.svg';
export const NO_CANCEL_SUBSCRIPTIONS_SVG = BASE_PATH + '/images/icons/cancel-subscription.svg';
export const SEARCH_OUTLINE_INACTIVE = BASE_PATH + '/images/mobile/svg/search_outline_inactive.svg';
export const SUNRISE_ICON = BASE_PATH + "/images/icons/sunrise.svg";
export const SEARCHBAR_ICON = BASE_PATH + '/images/mobile/svg/search.svg';
export const NOTIFICATION_ICON = BASE_PATH + '/images/icons/notification-outline.svg';
export const sharpCornerIcon = BASE_PATH + '/images/icons/polygonDark.svg';
export const hidePassword = BASE_PATH + '/images/icons/hide-password.svg';
export const hidePassword_grey = BASE_PATH + '/images/icons/hide-password-grey.svg';
export const eye = BASE_PATH + '/images/icons/password-visible.svg';
export const eye_grey = BASE_PATH + '/images/icons/password-visible-grey.svg';
export const HASTAG_ICON = BASE_PATH + '/images/desktop/hashtag.svg';
export const DV_Sent_Tip = BASE_PATH + '/images/desktop/icons/sent_tip.svg';
export const more_symbol = BASE_PATH + '/images/otherUser_profile_assests/more_symbol.svg';
export const INSIGHT = BASE_PATH + '/images/icons/insight.svg';
export const share_icon_profile = BASE_PATH + '/images/otherUser_profile_assests/share_icon_profile.svg';
export const CROSS = BASE_PATH + '/images/icons/cross_icon.svg';
export const REVIEW = BASE_PATH + '/images/icons/in-review.svg';
export const LIKE_ICON = BASE_PATH + '/images/mobile/time line icons/Like.svg';
export const comment_icon = BASE_PATH + '/images/otherUser_profile_assests/comment_icon.svg';
export const COMMENT_ICON = BASE_PATH + '/images/mobile/time line icons/comment.svg';
export const BOOKMARK_ICON = BASE_PATH + '/images/mobile/time line icons/Bookmark.svg';
export const FB_ICON = BASE_PATH + '/images/icons/facebook.svg';

export const TWITTER_ICON = BASE_PATH + '/images/icons/twitter.svg';
export const hashtag_icon = BASE_PATH + '/images/icons/hashtag_icon.svg';
export const NAV_CHAT_ICON = BASE_PATH + '/images/profile_images/icons/chat_icon.svg';
export const request_shotuout_post = BASE_PATH + '/images/shoutout_web/shoutout_post.svg';
export const Chevron_Right = BASE_PATH + '/images/desktop/icons/chevron_right.svg';
export const HUMBERGER_ICON = BASE_PATH + '/images/icons/humberger-icon.svg';
export const ANALYTICS_PLACEHOLDER_SVG = BASE_PATH + '/images/mobile/placeholderImages/analytics-placeholder.svg';
export const LOCKED_ICON = BASE_PATH + '/images/chat/locked.svg';
export const CUSTOM_ARROW = BASE_PATH + '/images/icons/left-arrow-baseColor.svg';
export const backArrow_black = BASE_PATH + '/images/icons/back-arrow-black.svg';
export const live_placeholder = BASE_PATH + '/images/icons/live_placeholder.png';
export const MORE_ICON_Dark = BASE_PATH + '/images/desktop/icons/more_darkGrey.svg';
export const SMILE_FACE = BASE_PATH + '/images/icons/smile-face.svg';
export const PLAY_ICON = BASE_PATH + "/images/mobile/svg/play-active.svg";
export const PLAY_ICON_BOLD = BASE_PATH + "/images/mobile/navigation-icons/live.svg";
export const EXCLUSIVE_ICON_BOLD = BASE_PATH + "/images/mobile/navigation-icons/exclusive_icon.svg";
export const TAGGED_ICON_BOLD = BASE_PATH + "/images/mobile/navigation-icons/tagged.svg";
export const REVIEWS_BOLD = BASE_PATH + "/images/mobile/navigation-icons/reviews.svg";
export const GOOGLE_ICON2 = BASE_PATH + '/images/google2.svg';
export const INFO_OUTLINE_RED = BASE_PATH + '/images/info_outline_red.svg';

export const EXPLORE_ICON_Active = BASE_PATH + '/images/desktop/icons/explore_blue.svg';
export const POSTING_ICON_Blue = BASE_PATH + '/images/desktop/icons/posting-blue.svg';

export const NOTIFICATION_ICON_Blue = BASE_PATH + '/images/icons/notification-outline-blue.svg';
export const homepage_guest = BASE_PATH + "/images/icons/homepage_guest.svg";
export const upArrowIcon = BASE_PATH + '/images/icons/Icon feather-chevron-right-1.svg';

export const PROFILE_White = BASE_PATH + '/images/desktop/icons/profile-white.svg';
export const Wallet_Icon_Black = BASE_PATH + '/images/desktop/icons/wallet-icon-black.svg';
export const Credit_Card_Icon_Black = BASE_PATH + '/images/desktop/icons/credit-card-black.svg';
export const Collection_Icon_Black = BASE_PATH + '/images/desktop/icons/collections-black.svg';
export const PURCHASE_POST_Black = BASE_PATH + '/images/desktop/svg/no_purchased_post.svg';
export const Heart_Inactive = BASE_PATH + '/images/mobile/profile/heart_inactive.svg';
export const Manage_Address_Icon_Black = BASE_PATH + '/images/desktop/icons/manage-address-black.svg';
export const MY_PURCHASES = BASE_PATH + '/images/shoutout_web/noun_Purchase_1898932.svg';
export const Billing_And_Plans_Icon_Black = BASE_PATH + '/images/desktop/icons/billing_and_plans_icon_black.svg';
export const Refer_Friends_Icon_Black = BASE_PATH + '/images/desktop/icons/refer-friends-black.svg';
export const Report_Problem_Icon_Black = BASE_PATH + '/images/desktop/icons/report-problem-black.svg';
export const VIDEOCALL_ICON = BASE_PATH + "/images/mobile/svg/VideoSettings.svg";
export const VIDEO_PRICE_ICON = BASE_PATH + "/images/mobile/svg/video_call_price_icon.svg";
export const Language_Icon_Black = BASE_PATH + '/images/desktop/icons/language-black.svg';
export const FAQs_Icon_Black = BASE_PATH + '/images/desktop/icons/faqs-black.svg';
export const MY_SUBSCRIPTION_SVG = BASE_PATH + '/images/mobile/svg/my-subscription.svg';
export const MY_SUBSCRIBERS_SVG = BASE_PATH + '/images/mobile/svg/my-subscribers.svg';
export const SETTINGS_SVG = BASE_PATH + '/images/mobile/svg/subscription_setting.svg';
export const NOTIFICATION_ICON_SVG = BASE_PATH + '/images/mobile/svg/notification_setting.svg';
export const Dashboard_Icon = BASE_PATH + '/images/icons/dashboard.svg';
export const HOME_ACTIVE = BASE_PATH + '/images/mobile/svg/home_active.svg';
export const CHAT_INACTIVE_ICON = BASE_PATH + '/images/profile_images/icons/chat-inactive.svg';
export const PROFILE_INACTIVE_ICON = BASE_PATH + '/images/profile_images/icons/profile-inactive.svg';
export const DV_Wallet_Icon = BASE_PATH + '/images/icons/dv_wallet_icon.svg';
export const rightArrowSvg = BASE_PATH + '/images/markate-place-page/Icon feather-arrow-right.svg';
export const MESSAGE_PLACEHOLDER = BASE_PATH + '/images/chat/message-placeholder.svg';
export const videoOrderIcon = BASE_PATH + "/images/shoutout_web/shoutvideo.svg";
export const SPEAKER = BASE_PATH + '/images/shoutout_web/speaker.svg';
export const moreOption_icon = BASE_PATH + '/images/shoutout_web/moreOption.svg';
export const reviewShuotoutIcon = BASE_PATH + "/images/icons/reviewShoutout.svg";
export const shoutout_review_placeholder = BASE_PATH + '/images/icons/reviews_placeholder.svg';
export const volume_mute = BASE_PATH + '/images/icons/volume_mute.svg';
export const volume_up = BASE_PATH + '/images/icons/volume_up.svg';
export const videoPlay_icon = BASE_PATH + '/images/shoutout_web/videoPlayBtn.svg';
export const NO_SHOUTOUT_PLACEHOLDER = BASE_PATH + '/images/mobile/placeholderImages/no shoutout.svg';
export const IMAGE_LOCK_ICON_Grey = BASE_PATH + '/images/icons/lock-icon-grey.svg';
export const DV_Share_Icon_Black = BASE_PATH + '/images/desktop/icons/share_icon_black.svg';
export const COMMENT_ICON_Dark = BASE_PATH + '/images/desktop/icons/comment_darkGrey.svg';
export const BOOKMARK_DARK_ICON = BASE_PATH + '/images/mobile/time line icons/BookmarkDark.svg';
export const BACK_TO_TOP = BASE_PATH + '/images/desktop/icons/back_to_top.svg';
export const SHARE_ICON = BASE_PATH + "/images/mobile/svg/export-variant.svg";
export const markatePlacehomeIcon = BASE_PATH + "/images/markate-place-page/markatePlaceHome.svg";
export const EXPLORE_ICON = BASE_PATH + "/images/mobile/svg/explore.svg";
export const POSTING_ICON = BASE_PATH + "/images/mobile/svg/posting.svg";
export const GRID_ICON = BASE_PATH + '/images/mobile/navigation-icons/grid.svg';
export const IMAGE_ICON = BASE_PATH + '/images/mobile/navigation-icons/image.svg';
export const VIDEO_ICON = BASE_PATH + '/images/mobile/navigation-icons/-video.svg';
export const IMAGE_OUTLINE_ICON = BASE_PATH + '/images/icons/image-outline.svg';
export const VIDEO_OUTLINE_ICON = BASE_PATH + '/images/icons/video-outline.svg';
export const LOCK_ICON = BASE_PATH + '/images/mobile/navigation-icons/lock.svg';
export const tagIcon = BASE_PATH + '/images/markate-place-page/tagIcon.svg';
export const playIconStory = BASE_PATH + '/images/markate-place-page/playIcon.svg';
export const user_category_time = BASE_PATH + '/images/markate-place-page/time.svg';
export const user_category_sort = BASE_PATH + '/images/markate-place-page/sort.svg';
export const user_category_filter = BASE_PATH + '/images/markate-place-page/filter.svg';
export const aboutSection1 = BASE_PATH + "/images/aboutPage/sectionOneNumber.svg";
export const aboutSection2 = BASE_PATH + "/images/aboutPage/sectionTwonumber.svg";
export const aboutSection3 = BASE_PATH + "/images/aboutPage/sectionThreeNumber.svg";
export const aboutSection4 = BASE_PATH + "/images/aboutPage/sectionFourNumber.svg";
export const sectionEarth = BASE_PATH + "/images/aboutPage/sectionEarth.svg";
export const sectionLiveTv = BASE_PATH + "/images/aboutPage/sectionLive.svg";
export const sectionTrue = BASE_PATH + "/images/aboutPage/sectionTrue.svg";
export const sectionFlash = BASE_PATH + "/images/aboutPage/sectionFlash.svg";
export const rightOrderArrow = BASE_PATH + '/images/mobile/payment/rightOrderArrow.svg';
export const NO_ORDER_PLACEHOLDER_MOBILE = BASE_PATH + '/images/mobile/placeholderImages/no order.svg';
export const STAR_ICON_OTHERPROFIE = BASE_PATH + '/images/icons/starIcon.svg';
export const back_icon_otherHeader = BASE_PATH + '/images/otherUser_profile_assests/back_icon.svg';
export const share_icon_otherHeader = BASE_PATH + '/images/otherUser_profile_assests/share_icon.svg';
export const more_icon_otherHeader = BASE_PATH + '/images/otherUser_profile_assests/more_icon.svg';
export const FOLLOW_ICON_OTHERPROFILE = BASE_PATH + '/images/icons/followUnfollow.svg';
export const CHAT_ICON_OTHERPROFILE = BASE_PATH + '/images/icons/chatIcon.svg';
export const NO_ACTIVE_SUBSCRIPTIONS_SVG = BASE_PATH + '/images/icons/active-subscription.svg';
export const Wallet_Icon = BASE_PATH + '/images/mobile/nav-menu/wallet-icon.svg';
export const Billing_And_Plans_Icon = BASE_PATH + '/images/mobile/nav-menu/billing_and_plans_icon.svg';
export const Credit_Card_Icon = BASE_PATH + '/images/mobile/nav-menu/credit-card.svg';
export const MY_PURCHASE_SVG = BASE_PATH + '/images/mobile/svg/myPurchases.svg';
export const Purchased_Posts_Icon = BASE_PATH + '/images/mobile/nav-menu/purchased-posts.svg';
export const Manage_Address_Icon = BASE_PATH + '/images/mobile/nav-menu/manage-address.svg';
export const videoIcon_doller = BASE_PATH + "/images/mobile/svg/videoIcon_doller.svg";
export const Collection_Icon = BASE_PATH + '/images/mobile/nav-menu/collections.svg';
export const Logout_Icon = BASE_PATH + '/images/mobile/nav-menu/logout.svg';
export const SETTINGS = BASE_PATH + '/images/mobile/svg/settings.svg';
export const Shopping_Bag_Inactive = BASE_PATH + '/images/mobile/profile/shopping_bag_inactive.svg';
export const collection_icon = BASE_PATH + '/images/mobile/profile/collection-icon.svg';
export const POSTS_ICON = BASE_PATH + '/images/icons/posts.svg';
export const EXCLUSIVE_ICON = BASE_PATH + '/images/icons/EXCLUSIVE.svg';
export const EXCLUSIVE_ICON_PROFILE = BASE_PATH + '/images/icons/exclusiveProfile.svg';
export const EXCLUSIVE_POST_ICON = BASE_PATH + '/images/mobile/navigation-icons/exclusive_post.svg';
export const SHOUTOUT_ICON_PROFILE = BASE_PATH + '/images/icons/light_shoutout.svg';
export const SHOUTOUT_ICON_PROFILE_BOLD = BASE_PATH + '/images/mobile/navigation-icons/shoutout.svg';
export const DARK_SHOUTOUT_ICON_PROFILE = BASE_PATH + '/images/icons/dark_shoutout.svg';
export const LIVE_ICON = BASE_PATH + '/images/icons/LIVE.svg';
export const TAGGED_ICON = BASE_PATH + '/images/icons/TAGGED.svg';
export const TAG_ICON = BASE_PATH + '/images/mobile/navigation-icons/tag_icon.svg';
export const REVIEWS_ICON = BASE_PATH + '/images/icons/REVIEWS.svg';
export const shoutout_base = BASE_PATH + "/images/profile_images/shoutout.svg";
export const VIDEO_OUTLINE = BASE_PATH + '/images/desktop/icons/live_video_outline.svg';

export const FIRE = BASE_PATH + '/images/livestrem-static/fire.svg';
export const MAP_POINTER = BASE_PATH + "/images/livestrem-static/map-pointer.svg";
export const EDIT4 = BASE_PATH + "/images/livestrem-static/edit-4.svg";
export const CREDIT_CARD = BASE_PATH + "/images/livestrem-static/credit-card.svg";
export const SPEAKER_ICONS = BASE_PATH + '/images/icons/speaker-icons.svg';

export const ARROW_GRADIENT_ICON = BASE_PATH + '/images/icons/arrowGradient.svg';
