import { getCookie } from "../session";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;
export const SUPPORT_EMAIL = 'tech@bombshellinfluencers.com';
export const WEB_LINK = process.env.NEXT_PUBLIC_WEB_LINK;
export const API_URL = 'https://api.testbombshellsite.com';
export const USER_NAME = 'bombshell';
export const PASSWORD = 'admin@testbombshellsite.com';
export const MQTT_URL = 'wss://mqtts.testbombshellsite.com:2083/mqtt';
export const MQTT_PASSWORD = 'BoMb2hzTxwBU6eyj';
export const MQTT_USERNAME = 'bombshellveremq';
export const ALT_TEXT = process.env.NEXT_PUBLIC_ALT_TEXT;
export const BITLY_KEY = '2781e18797d8530f426f81e6f8509c6bbdf5a854';
export const FIREBASE = 'AAAAiZYkaJc:APA91bGlU5MDg9pRwcPKLOnvGd10EgsQWikTuQIg3OxUiX-HrqCd5DhQdqWgyxmawdmmKLHCNUrmk8xHcYNrIgxigSnH4BJkzpKG5N6dk2OSKNm8UBB7Pv76Z2zA8IaVQbRRacq1s_Ef';
export const APP_ICON = BASE_PATH + '/images/app_icons/icon-256x256.png';
export const DESCRIPTION = `${APP_NAME} - Hottest Content From The Hottest Creators Around The World. We Curate Every Single Creator And Ensure All The Posts Are Unique And Completely Original`;
export const DEFAULT_LANGUAGE = 'en';
export const FAV_ICON16 = BASE_PATH + '/images/app_icons/favicon.png';
export const FAV_ICON36 = BASE_PATH + '/images/app_icons/favicon.png';
export const defaultCurrency = '$';
export const defaultCurrencyCode = 'USD';
export const defaultCountry = "US";
export const test_defaultCountry = 'US';
export const defaultLang = 'en';
export const GOOGLE_ID = '590929488023-ijdvnftcubmpho4vgpggg7ctfefgroiq.apps.googleusercontent.com';
export const FACEBOOK_ID = '696912407989774';
export const FACEBOOK_FIELDS = 'name,email,picture';
export const FACEBOOK_SCOPES = 'public_profile,user_friends,email';
export const defaultTimeZone = () => getCookie('zone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
export const FCM_TOPIC = 'fcm_topic';
export const FCM_CHAT_TOPIC = 'fcm_chat_topic';
export const FCM_TOKEN = 'fcm_token';
export const MAIN_DOMAIN = "https://testbombshellsite.com/"
export const STREAM_SERVICE = "LiveKit" // LiveKit || AGORA
export const ISOMETRIK_APP_SECRET = "SFMyNTY.g3QAAAACZAAEZGF0YXQAAAADbQAAAAlhY2NvdW50SWRtAAAAGDY0M2VhMjk0MjBhYWY1MDAwMTA3MGFjN20AAAAIa2V5c2V0SWRtAAAAJGExYjVkZTZkLTU5OTMtNDFkYi05MWExLWQ0MWQxZWQ2OGEzM20AAAAJcHJvamVjdElkbQAAACQ2NDk0Mjc2NC00OWQzLTQ2NzgtYWU4Yy00ZWNiMDhlMGM3YWFkAAZzaWduZWRuBgDDcacLiQE.6veiLxvBSZxvNIuzoAFWXgJJW1pGj8y3tSxGIk0tSd0"
export const WATERMARK_NAME = "bombshellinfluencers"

export const isAgency = () => getCookie("userType") === "3";

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
    crmMedia: "crmMedia",
    vaultMedia: "vaultMedia",
};
export const PROJECTS_CREDS = {
    accountId: '643ea29420aaf50001070ac7',
    userSecret: 'SFMyNTY.g3QAAAACZAAEZGF0YXQAAAADbQAAAAlhY2NvdW50SWRtAAAAGDY0M2VhMjk0MjBhYWY1MDAwMTA3MGFjN20AAAAIa2V5c2V0SWRtAAAAJDc1NzhmYjcxLWQyNjItNGMyZi1iNGRjLWNkMGMwNzQ5MDRhOG0AAAAJcHJvamVjdElkbQAAACQwNTg0Mzg0Zi0xOWJhLTRiODAtOWQyNS00NzQ1MDljZWIxZTdkAAZzaWduZWRuBgAbIq-UhwE.5f_HqpUseV-zNWY3Bq0FKnpj2z6TVBmkHOx1gLxP3kY',
    projectId: '0584384f-19ba-4b80-9d25-474509ceb1e7',
    licenseKey: 'lic-IMKdwqAmUJGARMalVE3APneqSnEYreBqZfu',
    keysetId: '7578fb71-d262-4c2f-b4dc-cd0c074904a8',
    appSecret: 'SFMyNTY.g3QAAAACZAAEZGF0YXQAAAADbQAAAAlhY2NvdW50SWRtAAAAGDY0M2VhMjk0MjBhYWY1MDAwMTA3MGFjN20AAAAIa2V5c2V0SWRtAAAAJDc1NzhmYjcxLWQyNjItNGMyZi1iNGRjLWNkMGMwNzQ5MDRhOG0AAAAJcHJvamVjdElkbQAAACQwNTg0Mzg0Zi0xOWJhLTRiODAtOWQyNS00NzQ1MDljZWIxZTdkAAZzaWduZWRuBgAQIq-UhwE.p_NXSuYWmYotKpLG733Ivi4_yVTDASNeHfLTXLxqD6g'
}

export const ISOMETRIK_PROJECTS_CREDS = {
    isometrikLicenseKey: "lic-IMKn02Av5QMxJx0HIEbK1z2OH0EoLm9BLDa",
    isometrikAppSecret: "SFMyNTY.g3QAAAACZAAEZGF0YXQAAAADbQAAAAlhY2NvdW50SWRtAAAAGDY0M2VhMjk0MjBhYWY1MDAwMTA3MGFjN20AAAAIa2V5c2V0SWRtAAAAJGExYjVkZTZkLTU5OTMtNDFkYi05MWExLWQ0MWQxZWQ2OGEzM20AAAAJcHJvamVjdElkbQAAACQ2NDk0Mjc2NC00OWQzLTQ2NzgtYWU4Yy00ZWNiMDhlMGM3YWFkAAZzaWduZWRuBgDDcacLiQE.6veiLxvBSZxvNIuzoAFWXgJJW1pGj8y3tSxGIk0tSd0",
}

export const ISOMETRIK_MQTT_CREDS = {
    URL: 'wss://connections.isometrik.io:2053/mqtt',
    Username: '1' + PROJECTS_CREDS.accountId + PROJECTS_CREDS.projectId,
    Password: PROJECTS_CREDS.licenseKey + PROJECTS_CREDS.keysetId,
    API_URL: 'https://apis.isometrik.io',
};

export const ISOMETRIK_MQTT_TOPICS = {
    Message: `/${PROJECTS_CREDS.accountId}/${PROJECTS_CREDS.projectId}/Message/`,
    PresenceEvents: `/${PROJECTS_CREDS.accountId}/${PROJECTS_CREDS.projectId}/Status/`,
    NewMessageEvent: `/${PROJECTS_CREDS.accountId}/${PROJECTS_CREDS.projectId}/`,
};
