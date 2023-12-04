import { withStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
import React from "react";
import isMobile from "../../hooks/isMobile";
// import JoinasSeller from "../../pages/join-as-seller";
import MyPurchasePage from "../../pages/virtual-requests";
import DvmoreSideBar from "../DvSidebar/DvmoreSideBar";

const WingspanSetupDialog = dynamic(() => import("../DvWallet/wingspanSetupDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawSuccessInfo = dynamic(() => import("../DvWallet/withdrawSuccess"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const RequestAgencymodal = dynamic(() => import("../../components/RequestAgencymodal"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const UnlinkAgency = dynamic(() => import("../../components/UnlinkAgency"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawWingspanMoneyDialog = dynamic(() => import("../DvWallet/WithdrawWingspanMoneyDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PostDialog = dynamic(() => import("../../components/post"), { loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>, })
const ChatNotes = dynamic(() => import("../../components/chat/chatButtons/ChatNotes").then(module => module.ChatNotes), {loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>})
const MsgDialog = dynamic(() => import("../../components/Dialog/MsgDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AttachVaultMedia = dynamic(() => import("../../components/Dialog/AttachVaultMedia"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteConfirmMemeber = dynamic(() => import("../dialog/deleteConfirm/delete-confirm-member"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CreateCustomerLists = dynamic(() => import("../dialog/manageList/createCustomerLists"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ManageList = dynamic(() => import("../../components/manageLists"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const MediaCarousal = dynamic(() => import("../../components/model/mediaCarousel"), { ssr: false, loading: () => <p>Loading...</p>, });
const RenameFolderDialog = dynamic(() => import("../dialog/vaultDialog/renameDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteFolderDialog = dynamic(() => import("../dialog/vaultDialog/deleteDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SelectFolderDialog = dynamic(() => import("../dialog/vaultDialog/selectDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ProfileSubmited = dynamic(() => import("../registration/profile-submited"), { ssr: false,loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BecomeCreator = dynamic(() => import("../../pages/become-creator"), { ssr: false });
const WithdrawMoneyDialog = dynamic(() => import("../DvWallet/WithdrawMoneyDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const TimeZone = dynamic(() => import("../../components/Drawer/TimeZone"), { ssr: false,loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
// const BecomeCreator = dynamic(() => import("../../pages/become-creator"), { ssr: false });
const SubSum = dynamic(() => import("../../components/SumSub/SumSub"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AccountDetails = dynamic(() => import("../../components/Drawer/accountDetails"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Category = dynamic(() => import("../registration/model-registration/category"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddAddress = dynamic(() => import("../../components/Drawer/AddAddress"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddBankAcc = dynamic(() => import("../../components/Drawer/AddBankAcc"), { ssr: false,loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddCard = dynamic(() => import("../../components/Drawer/AddCard"), { ssr: false });
const AddHighlightCover = dynamic(() => import("../../components/Drawer/AddHighlightCover"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddHighlightEditCover = dynamic(() => import("../../components/Drawer/AddHighlightEditCover"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddHighlightStory = dynamic(() => import("../../components/Drawer/AddHighlightStory"), { ssr: false,loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddressList = dynamic(() => import("../../components/Drawer/AddressList"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddStripeAcc = dynamic(() => import("../../components/Drawer/AddStripeAcc"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BankDetails = dynamic(() => import("../../components/Drawer/BankDetails"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BillingAndPlans = dynamic(() => import("../../components/Drawer/BillingAndPlans"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BookmarkPosts = dynamic(() => import("../../components/Drawer/bookmarkPosts"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BookmarkSelections = dynamic(() => import("../../components/Drawer/bookmarkSelectonDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BottomBookmarkMenu = dynamic(() => import("../../components/Drawer/bottomBookmarkMenu"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BuyPost = dynamic(() => import("../../components/Drawer/buyPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CancelSubscription = dynamic(() => import("../../components/Drawer/CancelSubscription"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CardsList = dynamic(() => import("../../components/Drawer/CardsList"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ChangeLanguage = dynamic(() => import("../../components/Drawer/ChangeLanguage"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Checkout = dynamic(() => import("../../components/Drawer/checkout"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PurchaseConfirmWallet = dynamic(() => import("../../components/Dialog/purchaseConfirmWallet"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Collection = dynamic(() => import("../../components/Drawer/collection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CommentBox = dynamic(() => import("../../components/Drawer/CommentBox"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ConfirmDialog = dynamic(() => import("../../components/Drawer/confirmDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CityDrawer = dynamic(() => import("../../components/Drawer/countryDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeactivateAcc = dynamic(() => import("../../components/Drawer/DeactivateAcc"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeactivateReasons = dynamic(() => import("../../components/Drawer/DeactivateReasons"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteCardConfirm = dynamic(() => import("../../components/Drawer/DeleteCardConfirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteCollection = dynamic(() => import("../../components/Drawer/deleteCollection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeletePost = dynamic(() => import("../../components/Drawer/DeletePost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteUser = dynamic(() => import("../../components/Drawer/DeleteUser"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const EditCollections = dynamic(() => import("../../components/Drawer/editCollection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const EditHighlightStory = dynamic(() => import("../../components/Drawer/EditHighlightStory"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const FAQ = dynamic(() => import("../../components/Drawer/FAQ"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const FavouritePosts = dynamic(() => import("../../components/Drawer/FavouritePosts"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
// navigation drawer
const FollowFollowing = dynamic(() => import("../../components/Drawer/FollowFollowing"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const GuestSideNavMenu = dynamic(() => import("../../components/Drawer/GuestSideNavMenu"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const JuicyGuestNavMenu = dynamic(() => import("../../components/Drawer/JuicyGuestNavMenu"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const NSFW_SIGNUP = dynamic(() => import("../registration/model-registration/nsfw"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
// const JoinJuicy = dynamic(() => import("../../pages/join-juicy"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HighlightStoryOptions = dynamic(() => import("../../components/Drawer/HighlightStoryOptions"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Logout = dynamic(() => import("../../components/Drawer/Logout"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const NewCollection = dynamic(() => import("../../components/Drawer/newCollection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PaymentSuccess = dynamic(() => import("../../components/Drawer/paymentSuccess"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PurchaseConfirm = dynamic(() => import("../../components/Drawer/purchaseConfirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PurchasedPosts = dynamic(() => import("../../components/Drawer/PurchasedPosts"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ReferFriends = dynamic(() => import("../../components/Drawer/ReferFriends"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ReportPost = dynamic(() => import("../../components/Drawer/ReportPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CollectionPosts = dynamic(() => import("../../components/Drawer/CollectionPosts"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Search = dynamic(() => import("../../components/Drawer/search"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SendTip = dynamic(() => import("../../components/Drawer/SendTip"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const RequestTip = dynamic(() => import("../../components/chat/ChatComponents/RequestTip"));
const ShareItems = dynamic(() => import("../../components/Drawer/ShareItems"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShareRefer = dynamic(() => import("../../components/Drawer/ShareRefer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SideNavMenu = dynamic(() => import("../../components/Drawer/SideNavMenu"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StoryViews = dynamic(() => import("../../components/Drawer/StoryViews"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Subscriptions = dynamic(() => import("../../components/Drawer/Subscriptions"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const TipSuccessSent = dynamic(() => import("../../components/Drawer/TipSentSuccess"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WalletIndex = dynamic(() => import("../../components/Drawer/WalletIndex"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Withdraw = dynamic(() => import("../../components/Drawer/Withdraw"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawalInfo = dynamic(() => import("../../components/Drawer/withDrawalInfo"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithDrawalLogs = dynamic(() => import("../../components/Drawer/withDrawalLogs"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawAmount = dynamic(() => import("../../components/Drawer/withdrawAmount"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ImageCropper = dynamic(() => import("../../components/image-cropper/ImageCropper"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StoryDialog = dynamic(() => import("../../containers/stories/StoryDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const RecoverWarningDialog = dynamic(() => import("../dialog/recoverWarning/recoverWarningDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HighlightStoryDialog = dynamic(() => import("../highlight-stories/highlight-story-dialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SelectoreDrawer = dynamic(() => import("./selectore-drawer/selectore-drawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ThumnailSelection = dynamic(() => import("./thumbnail-selectore/thumbnail-selectore"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ToasterDrawer = dynamic(() => import("./toaster-drawer/toaster-drawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Verification = dynamic(() => import("./verification/verification"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const VipMessagePlans = dynamic(() => import("../../components/Drawer/VipMessagePlans"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const VipMessagePopup = dynamic(() => import("../../components/Drawer/VipMessagePopup"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Error = dynamic(() => import("../../pages/_error"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const OwnStoriesModule = dynamic(() => import("../../containers/stories/OwnStories"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ViewPost = dynamic(() => import("../../components/Drawer/ViewPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StoryCarouselMobile = dynamic(() => import("../stories/StoryCarouselMobile"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StoryCarouselDesktop = dynamic(() => import("../stories/StoryCarouselDesktop"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const MySubsComponent = dynamic(() => import("../../components/Drawer/subscription/my-subscription"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const MySubscribersComponent = dynamic(() => import("../../components/Drawer/subscription/my-subscribers"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SubscriptionSettings = dynamic(() => import("../../components/Drawer/subscription/SubscriptionSettings"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SubscriptionPlans = dynamic(() => import("../../components/Drawer/subscription/SubscriptionPlans"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SubscriptionPlanSettings = dynamic(() => import("../../components/Drawer/subscription/SubscriptionPlanSettings"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteSubPlanConfirm = dynamic(() => import("../../components/Drawer/subscription/DeleteSubPlanConfirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CreatorPlanSubscription = dynamic(() => import("../../components/Drawer/subscription/CreatorPlanSubscription.jsx"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const EditBio = dynamic(() => import("../profile/edit-profile/edit-bio"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const VdoDrawer = dynamic(() => import("../../components/Drawer/VdoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddToHomeScreen = dynamic(() => import("../../components/Drawer/AddToHomeScreen"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Shoutout = dynamic(() => import("../../components/Drawer/shoutout/shoutout"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutForm = dynamic(() => import('../../components/Drawer/shoutout/shoutout-form'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutFormInstruction = dynamic(() => import('../../components/Drawer/shoutout/shoutout-instruction'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutFormOccasion = dynamic(() => import('../../components/Drawer/shoutout/shoutout-occasion'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutFormCheckbox = dynamic(() => import('../../components/Drawer/shoutout/shoutout-form-checkbox'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutConfirm = dynamic(() => import('../../components/Drawer/shoutout/shoutout-confirm'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutOrderSuccess = dynamic(() => import('../../components/Drawer/shoutout/shoutoutOrderSuccess'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const MyOrders = dynamic(() => import('../../components/Drawer/myOrder/my-orders'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Order = dynamic(() => import('../../components/Drawer/myOrder/order'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const OrderCancel = dynamic(() => import('../../components/Drawer/myOrder/orderCancel'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const VideoUpload = dynamic(() => import('../../components/Drawer/myOrder/uploadVideo'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutPayment = dynamic(() => import('../../components/Drawer/shoutout/shoutoutPayment'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const EditShoutoutPrice = dynamic(() => import("../profile/edit-profile/edit-shoutout-price"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HowItWorksDrawer = dynamic(() => import("../../components/Drawer/shoutout/howItWorks"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const FrndShoutout = dynamic(() => import("../../components/Drawer/shoutout/frnd-shoutout"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutContact = dynamic(() => import("../../components/Drawer/shoutout/shoutout-contact"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PurchaseDetails = dynamic(() => import("../../components/Drawer/myOrder/purchases"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShououtFormStaticField = dynamic(() => import("../../components/Drawer/shoutout/shououtFormStaticField"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const LiveStreamVideo = dynamic(() => import("./LiveStreamVideo/LiveStreamVideo"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const UserAddress = dynamic(() => import("./LiveStreamVideo/UserAddress"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ProductListTag = dynamic(() => import("./LiveStreamVideo/ProductListTag"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ExclusiveUnlock = dynamic(() => import("./exclusive-status/exclusive-unlock"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Emojis = dynamic(() => import("./emojis/emojis"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SelectTag = dynamic(() => import("./select-tag/select-tag"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Emoji = dynamic(() => import("../../components/Drawer/selectEmoji"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HashtagDrawer = dynamic(() => import("../../components/Drawer/hashtag/hashtagDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HashtagFollow = dynamic(() => import("../../components/Drawer/hashtag/hashtagFollow"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const FullScreenImgView = dynamic(() => import("../../components/Drawer/FullScreenImgView"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CancelStream = dynamic(() => import("./LiveStreamVideo/cancelStream"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StreamEnded = dynamic(() => import("./LiveStreamVideo/streamEnded"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const GoLiveScreen = dynamic(() => import("./LiveStreamVideo/goLiveDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StreamViewerList = dynamic(() => import("./LiveStreamVideo/streamViewerList"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const UserInfoDrawer = dynamic(() => import("./LiveStreamVideo/userInfoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const RecordedStreamPlayer = dynamic(() => import("./LiveStreamVideo/recordedStreamPlayer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const NSFW = dynamic(() => import("../../components/Drawer/NSFW"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Dv_ReportProblem = dynamic(() => import("../Dv_ReportProblem/Dv_ReportProblem"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StreamSettingsDrawer = dynamic(() => import("./LiveStreamVideo/streamSettings"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BroadcastDrawer = dynamic(() => import("./LiveStreamVideo/broadcastDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const StreamInfoDrawer = dynamic(() => import("./LiveStreamVideo/streamInfoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BulkMessage = dynamic(() => import('../../components/Drawer/bulkMessage/bulkMessage'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CreateBulkMessage = dynamic(() => import('../../components/Drawer/bulkMessage/createBulkMessage'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AllLockedPosts = dynamic(() => import('../../components/Drawer/bulkMessage/all_locked_post'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SingleBulkMessage = dynamic(() => import('../../components/Drawer/bulkMessage/singleBulkMessage'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AttachedFile = dynamic(() => import("../dialog/attachedFIleDialog/attachedFileDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SetDuration = dynamic(() => import("../../components/Drawer/videoCall/setDuration"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SetHours = dynamic(() => import("../../components/Drawer/videoCall/setHours"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DataOverride = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/dataOverride"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SetAddOverride = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/setAddOverride"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const VideoCallRequest = dynamic(() => import("../../components/Drawer/videoCall/videoCallRequest"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const VideoDevices = dynamic(() => import("../../containers/videoCall/conference/videoDevices"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ConfirmVideoCall = dynamic(() => import("../../components/Drawer/videoCall/confirmVideoCall"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SocialMediaLinks = dynamic(() => import("../dialog/socialMediaLinks/socialMediaLinks"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const RollerTimePicker = dynamic(() => import("../../components/rollerTimePicker"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const JoinAs = dynamic(() => import("../../components/Drawer/joinAs"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HashtagSearchDrawer = dynamic(() => import("../../components/Drawer/hashtag/HashtagSearchDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BulkMsgViewer = dynamic(() => import("../../components/Drawer/bulkMessage/BulkMsgViewer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SortUsersByCategory = dynamic(() => import("../../components/Drawer/SortUsersByCategory"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const FilterUserByCategories = dynamic(() => import("../../components/Drawer/filterUserByCategories"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
// const AutoMessage = dynamic(() => import("../../pages/automessage"), { ssr: false });
const RateCreator = dynamic(() => import("../dialog/rateCreaterShoutout/rateCreator"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SetSchedule = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/SetSchedule"), { ssr: false,loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ProductTagging = dynamic(() => import("../../components/Drawer/videoCall/productTagging"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Document = dynamic(() => import("../document/document"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddExtension = dynamic(() => import("../videoCall/addExtension"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HomepageVideoDrawer = dynamic(() => import("../../components/Drawer/homePageVideoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShoutoutDetail = dynamic(() => import("../../components/Drawer/shoutoutDetail"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ReviewTab = dynamic(() => import("../profile/reviewTab"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PostCarouselDrawer = dynamic(() => import("../../components/Drawer/post-carousel-drawer.jsx"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Language = dynamic(() => import("../../pages/language"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PriceSection = dynamic(() => import("../../containers/videoCall/index"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Drawer = dynamic(() => import("@material-ui/core/Drawer"), {
  ssr: false,
});
const BotMessage = dynamic(() => import("../../components/Drawer/BotMessage"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ImgFullScreenView = dynamic(() => import("../../components/Drawer/ImgFullScreenView"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteConfirm = dynamic(() => import("../dialog/deleteConfirm/delete-confirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CommentOptions = dynamic(() => import("../../components/Dialog/commentOptions"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddCoins = dynamic(() => import("../../components/Dialog/AddCoins"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CoinsAddedSuccess = dynamic(() => import("../../components/Dialog/CoinsAddedSuccess"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PurcahseNewPost = dynamic(() => import("../../components/Dialog/PurchaseNewPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SuccessPayment = dynamic(() => import("../../components/Dialog/SuccessPayment"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ForgotPassword = dynamic(() => import("../ForgotPassword/ForgotPassword"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ProfileDocSubmitted = dynamic(() => import("../SignUpModel/SignUpModel2"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const VideoCallPriceSettings = dynamic(() => import("../../containers/videoCall/priceSection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ChooseDateOverRideType = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/ChooseOverRideType"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ViewOverRideSlots = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/ViewOverRideSlots"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ConfirmationDrawer = dynamic(() => import("../../components/Drawer/confirmationDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });

const styles = {
  fullList: {
    width: "100vw",
  },
};

/**
 * @description used for drawers
 * @author Manish
 * @date 2020-12-25
 * @param {drawerData,handlerDialog ,type} - {drawerData: object, handlerDialog: method ,type:string}: Required
 */

const CustomDrawer = (props) => {
  const [mobileView] = isMobile();
  let { anchor, drawerData } = props;
  let drawerInnerContent = () => {
    switch (props.type) {
      case "verification":
        return (
          <Verification
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></Verification>
        );
        break;

      case "radioSelectore":
        return (
          <SelectoreDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></SelectoreDrawer>
        );
        break;

      case "paymentSuccess":
        return (
          <PaymentSuccess
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></PaymentSuccess>
        );
        break;

      case "withdrawMoney":
        return (
          <WithdrawMoneyDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></WithdrawMoneyDialog>
        );

      case "accountDetails":
        return (
          <AccountDetails
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AccountDetails>
        );
        break;

      case "addCard":
        return (
          <AddCard
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AddCard>
        );
        break;

      case "editCollection":
        return (
          <EditCollections
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></EditCollections>
        );
        break;

      case "thumbSelectore":
        return (
          <ThumnailSelection
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "drawerToaster":
        return (
          <ToasterDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ToasterDrawer>
        );
        break;

      case "following":
        return (
          <FollowFollowing
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></FollowFollowing>
        );
        break;

      case "followers":
        return (
          <FollowFollowing
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></FollowFollowing>
        );
        break;

      case "checkout":
        return (
          <Checkout
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></Checkout>
        );
        break;

      case "Set_duration":
        return (
          <SetDuration
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></SetDuration>
        );
        break;

      case "Set_hours":
        return (
          <SetHours
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></SetHours>
        );
        break;


      case "chooseOverRideType":
        return (
          <ChooseDateOverRideType
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ChooseDateOverRideType>
        );
        break;

      case "viewOverRideSlots":
        return (
          <ViewOverRideSlots
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ViewOverRideSlots>
        );
        break;

      case "confirmationDrawer":
        return (
          <ConfirmationDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "Set_schedule":
        return (
          <SetSchedule
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></SetSchedule>
        );
        break;

      case "Product_Tagging":
        return (
          <ProductTagging
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "dataOverride":
        return (
          <DataOverride
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></DataOverride>
        );
        break;

      case "setAddOverride":
        return (
          <SetAddOverride
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></SetAddOverride>
        );
        break;

      case "confirmVideoCall":
        return (
          <ConfirmVideoCall
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ConfirmVideoCall>
        );
        break;

      case "videoCallRequest":
        return (
          <VideoCallRequest
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></VideoCallRequest>
        );
        break;

      case "changeVideoDevice":
        return (
          <VideoDevices
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "addExtensionVideo":
        return (
          <AddExtension
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "rollerTimePicker":
        return (
          <RollerTimePicker
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></RollerTimePicker>
        );
        break;

      case "MsgDialog":
        return (
          <MsgDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></MsgDialog>
        );
        break;

      case "timeZone":
        return (
          <TimeZone
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "confirmDrawer":
        return (
          <ConfirmDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ConfirmDialog>
        );
        break;
      case "buyPost":
        return (
          <BuyPost
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></BuyPost>
        );
        break;
      case "SentTip":
        return (
          <SendTip
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></SendTip>
        );
        break;
      case "RequestTip":
        return (
          <RequestTip
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></RequestTip>
        );
        break;

      case "cityDrawer":
        return (
          <CityDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></CityDrawer>
        );
        break;

      case "TipSentSuccess":
        return <TipSuccessSent></TipSuccessSent>;
        break;

      case "ImageCropper":
        return (
          <ImageCropper
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ImageCropper>
        );
        break;

      case "SideNavMenu":
        return (
          <SideNavMenu
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></SideNavMenu>
        );
        break;

      case "Logout":
        return (
          <Logout
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></Logout>
        );
        break;

      case "DeactivateAcc":
        return (
          <DeactivateAcc
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></DeactivateAcc>
        );
        break;

      case "DeactivateReasons":
        return (
          <DeactivateReasons
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></DeactivateReasons>
        );
        break;

      case "ChangeLanguage":
        return (
          <ChangeLanguage
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ChangeLanguage>
        );
        break;

      case "DeleteUser":
        return (
          <DeleteUser
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></DeleteUser>
        );
        break;

      case "FAQ":
        return (
          <FAQ
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></FAQ>
        );
        break;

      case "Cards":
        return (
          <CardsList
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></CardsList>
        );
        break;

      case "CREATE_POST":
        return (
          <PostDialog
            mode='create'
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "EDIT_POST":
        return (
          <PostDialog
            mode='edit'
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "DeletePost":
        return (
          <DeletePost
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></DeletePost>
        );
        break;
      case "Address":
        return (
          <AddressList
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AddressList>
        );
        break;

      case "COMMENT":
        return (
          <CommentBox
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></CommentBox>
        );
        break;

      case "Wallet":
        return (
          <WalletIndex
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></WalletIndex>
        );
        break;

      case "Withdraw":
        return (
          <Withdraw
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></Withdraw>
        );
        break;
      case "withDrawalLogs":
        return (
          <WithDrawalLogs
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></WithDrawalLogs>
        );
        break;
      case "withdrawalInfo":
        return (
          <WithdrawalInfo
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></WithdrawalInfo>
        );
        break;

      case "WithdrawWingspanMoney":
        return (
          <WithdrawWingspanMoneyDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "WithdrawSuccessInfo":
        return (
          <WithdrawSuccessInfo
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "WingspanSetupDialog":
        return (
          <WingspanSetupDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "WithDrawanDialog":
        return (
          <WithdrawAmount
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></WithdrawAmount>
        );
        break;

      case "AddBankAcc":
        return (
          <AddBankAcc
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AddBankAcc>
        );
        break;

      case "AddStripeAcc":
        return (
          <AddStripeAcc
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AddStripeAcc>
        );
        break;

      case "BankDetails":
        return (
          <BankDetails
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></BankDetails>
        );
        break;

      case "DeleteCardConfirm":
        return (
          <DeleteCardConfirm
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></DeleteCardConfirm>
        );
        break;
      case "newCollection":
        return (
          <NewCollection
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></NewCollection>
        );
        break;
      case "BookmarkSelections":
        return (
          <BookmarkSelections
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "deleteCollection":
        return (
          <DeleteCollection
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></DeleteCollection>
        );
        break;
      case "bottomBookmarkMenu":
        return (
          <BottomBookmarkMenu
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></BottomBookmarkMenu>
        );
        break;

      case "search":
        return (
          <Search
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></Search>
        );
        break;
      case "bookmarkPosts":
        return (
          <BookmarkPosts
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></BookmarkPosts>
        );
        break;
      case "collection":
        return (
          <Collection
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></Collection>
        );
        break;
      case "purchseConfirmDialog":
        return (
          <PurchaseConfirm
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
      case "ADDSocialMediaLinks":
        return (
          <SocialMediaLinks
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "REPORT_POST":
        return (
          <ReportPost
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ReportPost>
        );
        break;

      case "STORY":
        return <StoryDialog {...props.drawerData} />;
      case "STORY_CAROUSEL_MOB":
        return <StoryCarouselMobile {...props.drawerData} />

      case "STORY_CAROUSEL_DESKTOP":
        return <StoryCarouselDesktop {...props.drawerData} />

      case "OWN_STORY":
        return (
          <OwnStoriesModule
            {...props.drawerData}
            mobileView={mobileView}
          />
        );
        // return <OwnStoryDialog {...props.drawerData}></OwnStoryDialog>;
        break;

      case "DELETE_CHAT":
        return (
          <RecoverWarningDialog {...props.drawerData}></RecoverWarningDialog>
        );

      case "HIGHLIGHT_STORY_OPTIONS":
        return (
          <HighlightStoryOptions
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></HighlightStoryOptions>
        );
        break;

      case "SHARE_ITEMS":
        return <ShareItems {...props.drawerData}></ShareItems>;

      case "SHARE_REFER":
        return <ShareRefer {...props.drawerData} />;

      // case "Status":
      //   return (
      //     <ModalStory
      //       {...props.drawerData}
      //                  onClose={props.handleClose.bind(null, props.type)}

      //     ></ModalStory>
      //   );
      //   break;

      case "BillingPlans":
        return (
          <BillingAndPlans
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "manageCustomerLists":
        return (
          <ManageList
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "Subscriptions":
        return (
          <Subscriptions
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "STORY_VIEWS":
        return (
          <StoryViews
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></StoryViews>
        );

      case "GuestSideNavMenu":
        return (
          <GuestSideNavMenu
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></GuestSideNavMenu>
        );
        break;

      case "JuicyGuestNavMenu":
        return (
          <JuicyGuestNavMenu
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></JuicyGuestNavMenu>
        );
        break;

      case "NSFW_Signup":
        return (
          <NSFW_SIGNUP
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);
        break;

      case "BECOME_CREATOR":
        return (
          <BecomeCreator
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);
        break;

      case "JOIN_SELLER":
        return (
          <JoinasSeller
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);
        break;

      case "join_juicy":
        return (
          <JoinJuicy
            {...props.dialogData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);
        break;

      case "ADD_HIGHLIGHT_STORY":
        return (
          <AddHighlightStory
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AddHighlightStory>
        );
        break;

      case "ADD_HIGHLIGHT_COVER":
        return (
          <AddHighlightCover
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AddHighlightCover>
        );
        break;

      case "ADD_HIGHLIGHT_EDIT_COVER":
        return (
          <AddHighlightEditCover
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></AddHighlightEditCover>
        );
        break;

      case "EDIT_HIGHLIGHT_STORY":
        return (
          <EditHighlightStory
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></EditHighlightStory>
        );
        break;

      case "HIGHLIGHT_STORY":
        return (
          <HighlightStoryDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></HighlightStoryDialog>
        );
        break;

      case "ReferFriends":
        return (
          <ReferFriends
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ReferFriends>
        );
        break;

      case "purchasedPosts":
        return (
          <PurchasedPosts
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></PurchasedPosts>
        );
        break;

      case "cancelSubscription":
        return (
          <CancelSubscription
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></CancelSubscription>
        );
        break;

      // case "DV_Story":
      //   return (
      //     <Dv_Stories
      //       {...props.drawerData}
      //       handlerDialog={props.handlerDialog}
      //       onClose={props.handleClose.bind(null, props.type)}
      //     ></Dv_Stories>
      //   );
      //   break;

      case "FAVOURITE_POSTS":
        return (
          <FavouritePosts
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></FavouritePosts>
        );
        break;

      case "COLLECTION_POSTS":
        return (
          <CollectionPosts
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></CollectionPosts>
        );
        break;

      case "VIP_MESSAGE_PLANS":
        return (
          <VipMessagePlans
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></VipMessagePlans>
        );
        break;

      case "VIP_MESSAGE_POPUP":
        return (
          <VipMessagePopup
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></VipMessagePopup>
        );
        break;

      case "ViewPost":
        return (
          <ViewPost
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          ></ViewPost>
        );
        break;

      case "MySubsComponent":
        return (
          <MySubsComponent
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      // Added on April 27th, 2021 by Bhavleen
      case "MySubscribersComponent":
        return (
          <MySubscribersComponent
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "MyShoutoutPurchases":
        return (
          <MyPurchasePage
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "SubscriptionSettings":
        return (
          <SubscriptionSettings
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "SubscriptionPlans":
        return (
          <SubscriptionPlans
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "SubscriptionPlanSettings":
        return (
          <SubscriptionPlanSettings
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "DeleteSubPlanConfirm":
        return (
          <DeleteSubPlanConfirm
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "CreatorPlanSubscription":
        return (
          <CreatorPlanSubscription
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "addAddress":
        return (
          <AddAddress
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "EDIT_BIO":
        return (
          <EditBio
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "VDO_DRAWER":
        return (
          <VdoDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "HOMEPAGE_VIDEO_DRAWER":
        return (
          <HomepageVideoDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "addtoHomeScreen":
        return (
          <AddToHomeScreen
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "Shoutout":
        return (
          <Shoutout
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutForm":
        return (
          <ShoutoutForm
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutFormIntro":
        return (
          <ShoutoutFormIntro
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutFormInstruction":
        return (
          <ShoutoutFormInstruction
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutFormInstructionStaticField":
        return (
          <ShououtFormStaticField
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutFormOccasion":
        return (
          <ShoutoutFormOccasion
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutFormCheckbox":
        return (
          <ShoutoutFormCheckbox
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutConfirm":
        return (
          <ShoutoutConfirm
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutOrderSuccess":
        return (
          <ShoutoutOrderSuccess
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "MyOrders":
        return (
          <MyOrders
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "PURCHASE_DETAILS":
        return (
          <PurchaseDetails
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "Order":
        return (
          <Order
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "OrderCancel":
        return (
          <OrderCancel
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "VideoUpload":
        return (
          <VideoUpload
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "ShoutoutPayment":
        return (
          <ShoutoutPayment
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "EDIT_SHOUTOUT_PRICE":
        return (
          <EditShoutoutPrice
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "report_problem":
        return (
          <Dv_ReportProblem
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
      case "openLiveStream":
        return (
          <LiveStreamVideo
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "howItWorksDrawer":
        return (
          <HowItWorksDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "FrndShoutout":
        return (
          <FrndShoutout
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );


      case "ShoutoutContact":
        return (
          <ShoutoutContact
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "LiveStreamCancel":
        return (
          <CancelStream
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
      case "STREAM_ENDED":
        return (
          <StreamEnded
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      // case "SCHEDULE_POPUP":
      //   return (
      //     <ScheduleStreamDrawer
      //       {...props.drawerData}
      //       handlerDialog={props.handlerDialog}
      //       onClose={props.handleClose.bind(null, props.type)}
      //     />
      //   );
      case "GO_LIVE_STREAM":
        return (
          <GoLiveScreen
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);

      case "STREAM_VIEWER_LIST":
        return (
          <StreamViewerList
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);

      case "STREAM_SETTINGS":
        return (
          <StreamSettingsDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);


      case "START_SCHEDULE_BROADCAST":
        return (
          <BroadcastDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);

      case "STREAM_INFO_POPUP":
        return (
          <StreamInfoDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);



      case "USER_INFO_POPUP":
        return (
          <UserInfoDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);

      case "RECORDED_STREAM_PLAY":
        return (
          <RecordedStreamPlayer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />);

      case "handleUserAdd":
        return (
          <UserAddress
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "handleProductTg":
        return (
          <ProductListTag
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "unlock":
        return (
          <ExclusiveUnlock
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "emojis":
        return (
          <Emojis
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
      case "selectTag":
        return (
          <SelectTag
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "emoji":
        return (
          <Emoji
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "HashtagDrawer":
        return (
          <HashtagDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "HashtagFollow":
        return (
          <HashtagFollow
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "fullScreenImgView":
        return (
          <FullScreenImgView
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "NSFW":
        return (
          <NSFW
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "FrgtPass":
        return (
          <ForgotPassword
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "bulkMessage":
        return (
          <BulkMessage
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "createBulkMessage":
        return (
          <CreateBulkMessage
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "allLockedPost":
        return (
          <AllLockedPosts
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "singleBulkMessage":
        return (
          <SingleBulkMessage
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "attachedFile":
        return (
          <AttachedFile
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "joinAs":
        return (
          <JoinAs
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "HashtagSearchDrawer":
        return (
          <HashtagSearchDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "bulkMsgViewer":
        return (
          <BulkMsgViewer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "sortByCategories":
        return (
          <SortUsersByCategory
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "category":
        return (
          <Category
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "sortByUserFilters":
        return (
          <FilterUserByCategories
            {...props.drawerData}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;
      case "auto_message":
        return (
          <AutoMessage
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "rateCreator":
        return (
          <RateCreator
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
      case "chnageDocument":
        return (
          <Document
            {...props.dialogData}
            doc={drawerData.doc}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
      case "shoutoutDetail":
        return (
          <ShoutoutDetail
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "videoCallSettings":
        return (
          <VideoCallPriceSettings
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;


      case "DeleteConfirm":
        return (
          <DeleteConfirm
            {...props.dialogData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose}
          ></DeleteConfirm>
        );
        break;
      case "reviewShoutout":
        return (
          <ReviewTab
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
      case "postCarousel":
        return (
          <PostCarouselDrawer
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "BotMessage":
        return (
          <BotMessage
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "imgFullScreenView":
        return (
          <ImgFullScreenView
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "Language":
        return (
          <Language
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "PriceSection":
        return (
          <PriceSection
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "MoreSideNav":
        return (
          <DvmoreSideBar
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "SumSub":
        return (
          <SubSum
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "CommentOptions":
        return (
          <CommentOptions
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "profileDocSubmitted":
        return (
          <ProfileDocSubmitted
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "profileSubmitted":
        return (
          <ProfileSubmited
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );

      case "renameFiles":
        return (
          <RenameFolderDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "deleteFiles":
        return (
          <DeleteFolderDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "selectFiles":
        return (
          <SelectFolderDialog
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "RequestAgencymodal":
        return (
          <RequestAgencymodal
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)} />
        )
      case "UnlinkAgency":
        return (
          <UnlinkAgency
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)} />
        )
      case "openMediaCarousel":
        return (
          <MediaCarousal
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "addCoins":
        return (
          <AddCoins
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "coinsAddedSuccess":
        return (
          <CoinsAddedSuccess
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "purchaseNewPost":
        return (
          <PurcahseNewPost
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "successPayment":
        return (
          <SuccessPayment
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        );
        break;

      case "purchaseConfirmWallet":
        return (
          <PurchaseConfirmWallet
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "createCustomerLists":
        return (
          <CreateCustomerLists
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "confirmDeleteMemeber":
        return (
          <DeleteConfirmMemeber
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )


      case "createCustomerLists":
        return (
          <CreateCustomerLists
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "AttachVaultMedia":
        return (
          <AttachVaultMedia
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )

      case "confirmDeleteMemeber":
        return (
          <DeleteConfirmMemeber
            {...props.drawerData}
            handlerDialog={props.handlerDialog}
            onClose={props.handleClose.bind(null, props.type)}
          />
        )
      case "chatNotes":
        return <ChatNotes {...props.drawerData}
          handlerDialog={props.handlerDialog}
          onClose={props.handleClose.bind(null, props.type)}
        />


      default:
        return (
          <Error onClose={props.handleClose.bind(null, props.type)} />
        );
    }
  };

  return (
    <React.Fragment>
      <Drawer
        onBackdropClick={
          drawerData && drawerData.drawerClick
            ? drawerData.drawerClick
            : !drawerData?.onBackdropClick && props.handleClose.bind(null, props.type)
        }
        disableBackdropClick={props.disableBackdropClick}
        disableEscapeKeyDown
        anchor={anchor}
        className={`w-100 ${props.type}`}
        PaperProps={{
          className: `w-100 overflow-hidden testp[rops] ${props.type} ${(drawerData && drawerData.paperClass) || ""
            }`,
        }}
        open={props.open}
        onClose={!drawerData?.onBackdropClick && props.handleClose.bind(null, props.type)}
      >
        <div
          className={`w-100 subscriptionSetting.stipeAccDi targetDrawer h-100 specific_section_bg text-app`}
          id="removeME"
        >
          {drawerInnerContent()}
        </div>
      </Drawer>
      <style jsx>
        {
          `:global(.MuiDrawer-paper) {
            border-top-left-radius: ${props.drawerData?.noBorderRadius ? "0px" : "20px"} !important;
            border-top-right-radius:  ${props.drawerData?.noBorderRadius ? "0px" : "20px"} !important;
          }`
        }
      </style>
    </React.Fragment>
  );
};

export default withStyles(styles)(CustomDrawer);
