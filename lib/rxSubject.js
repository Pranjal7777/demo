// RxJS v6+
import { Subject } from "rxjs";
export const DialogOpen = new Subject();
export const DialogClose = new Subject();
export const DrawerOpen = new Subject();
export const DrawerClose = new Subject();
export const snakbar = new Subject();
export const StickySnackbar = new Subject();
export const StickySnackbarClose = new Subject();
export const handleLoader = new Subject();
export const handleinfoLoader = new Subject();
export const sessionExpire = new Subject();
export const CarouselOpen = new Subject();
export const PagerLoader = new Subject();

export const ackSubject = new Subject();
export const messageSubject = new Subject();
export const subscribeTopic = new Subject();
export const unsubscribeTopic = new Subject();
export const userStatus = new Subject();
export const userTypingStatus = new Subject();
export const sendTypeAck = new Subject();
export const newNotification = new Subject();
export const notification = new Subject();
export const geolocationblock = new Subject();
export const notificationblock = new Subject();
export const userBlock = new Subject();
export const shoutoutOutgoing = new Subject();
export const shoutoutIncoming = new Subject();
export const userBlockStatus = new Subject();
export const changeDealStatus = new Subject();
export const notificationMarkToZero = new Subject();
export const withdrawTransaction = new Subject();
export const rechargeWalletCoins = new Subject();

export const ProgressLoader = new Subject();

export const addUpdateAsyncTask = new Subject();

export const reConnectionSubject = new Subject();

export const refreshStoryApi = new Subject();

export const CustomPagerLoader = new Subject();

export const OnlineOfflineSubject = new Subject();

export const UpdateModelCardPostSubject = new Subject();

export const SubscribeIsometrikTopic = new Subject();

export const UnSubscribeIsometrikTopic = new Subject();

// LiveStream
export const endCurrentViewStream = new Subject();
export const skipCurrentViewStream = new Subject();
export const addNewViewerStream = new Subject();
export const removeThisViewerStream = new Subject();
export const animateBroadcasterStream = new Subject();
export const localVideoCamera = new Subject();
export const currVideoDevId = new Subject()
export const switchCamera = new Subject()

// Upload Progress Loader
export const uploadProgressSubject = new Subject();

// Video Call Subject
export const pushMessageToConferenceSubject = new Subject();
export const VideoAnalytics = new Subject();
export const customMessageSubject = new Subject();
export const postUpadteSubject = new Subject();

export const updateBlkMsgSubject = new Subject();
export const deleteBlkMsgSubject = new Subject();
export const carouselPaginationSubject = new Subject();
export const fetchSlotsSubject = new Subject()

export const sticky_bottom_snackbar = ({ message, type }) => {
    StickySnackbar.next({ message, type });
};