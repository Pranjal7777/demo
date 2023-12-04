import dynamic from "next/dynamic";
import React from "react";
import S3Upload from "../../components/FileUploadS3/S3Upload";
import CreateType from "../../components/post/CreateType";

//material ui dialog component
const Dialog = dynamic(() => import("@material-ui/core/Dialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DialogContent = dynamic(() => import("@material-ui/core/DialogContent"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ChatNotes = dynamic(() => import("../../components/chat/chatButtons/ChatNotes").then(module => module.ChatNotes))
//material ui dialog content
const WingspanSetupDialog = dynamic(() => import("../DvWallet/wingspanSetupDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const TransactionHistoryDetails = dynamic(() => import("../DvWallet/transactionHistoryDetails"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawSuccessInfo = dynamic(() => import("../DvWallet/withdrawSuccess"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawChargeDetails = dynamic(() => import("../DvWallet/withdrawChargeDetails"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AttachVaultMedia = dynamic(() => import("../../components/Dialog/AttachVaultMedia"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CreateCustomerLists = dynamic(() => import("./manageList/createCustomerLists"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const RenameFolderDialog = dynamic(() => import("./vaultDialog/renameDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteFolderDialog = dynamic(() => import("./vaultDialog/deleteDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CommentOptions = dynamic(() => import("../../components/Dialog/commentOptions"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawMoneyDialog = dynamic(() => import("../DvWallet/WithdrawMoneyDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawWingspanMoneyDialog = dynamic(() => import("../DvWallet/WithdrawWingspanMoneyDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HomepageCommentBox = dynamic(() => import("../../components/Drawer/videoCall/HomepageCommentBox"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const TimeZone = dynamic(() => import("../../components/Drawer/TimeZone"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const HashTagPopup = dynamic(() => import("../hashTagPopup/HashTagPopup"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PostSlider = dynamic(() => import( /* webpackChunkName: "PostSlider" */ "../../components/image-slider2/PostSlider"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const JuicyTimeZone = dynamic(() => import("../../components/Drawer/JuicyTimeZone"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DVmoreSideBar = dynamic(() => import("../DvSidebar/DvmoreSideBar"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WalletFilters = dynamic(() => import("../../components/Dialog/WalletFilters"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AccAccepted = dynamic(() => import("../../components/Dialog/AccAccepted"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const MsgDialog = dynamic(() => import("../../components/Dialog/MsgDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteConfirm = dynamic(() => import("./deleteConfirm/delete-confirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteConfirmMemeber = dynamic(() => import("./deleteConfirm/delete-confirm-member"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const Logout = dynamic(() => import("../../components/Drawer/Logout"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShareItems = dynamic(() => import("../../components/Drawer/ShareItems"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ShareRefer = dynamic(() => import("../../components/Drawer/ShareRefer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DvEditPhoneNum = dynamic(() => import("../DvEditProfile/DvEditPhoneNum"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ChangePassword = dynamic(() => import("../profile/edit-profile/change-password"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ToasterDrawer = dynamic(() => import("../drawer/toaster-drawer/toaster-drawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ConfirmDialog = dynamic(() => import("../../components/Drawer/confirmDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeactivateReasons = dynamic(() => import("../../components/Drawer/DeactivateReasons"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ForgotPassword = dynamic(() => import("../ForgotPassword/ForgotPassword"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const ForgotPassword1 = dynamic(() => import("../ForgotPassword/ForgotPassword1"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const FaqContent = dynamic(() => import("../../components/Dialog/FaqContent"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddAddress = dynamic(() => import("../../components/Drawer/AddAddress"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteCardConfirm = dynamic(() => import("../../components/Drawer/DeleteCardConfirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DvEditEmail = dynamic(() => import("../DvEditProfile/DvEditEmail"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddCard = dynamic(() => import("../../components/Drawer/AddCard"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const PaymentSuccess = dynamic(() => import("../../components/Drawer/paymentSuccess"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddStripeAcc = dynamic(() => import("../../components/Drawer/AddStripeAcc"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddBankAcc = dynamic(() => import("../../components/Drawer/AddBankAcc"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const AddCollections = dynamic(() => import("../../components/Dialog/addCollection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const SelectoreDialog = dynamic(() => import("../drawer/selectore-drawer/selectore-drawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const WithdrawalInfo = dynamic(() => import("../../components/Drawer/withDrawalInfo"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const DeleteUser = dynamic(() => import("../../components/Drawer/DeleteUser"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const BlockedUser = dynamic(() => import("../../components/Drawer/BlockedUser"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const FollowFollowing = dynamic(() => import("../../components/Drawer/FollowFollowing"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p> });
const CommentBox = dynamic(() => import("../../components/Drawer/CommentBox"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SendTipDialog = dynamic(() => import("../../components/Drawer/SendTip"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const RequestTip = dynamic(() => import("../../components/chat/ChatComponents/RequestTip"));
const PurchaseConfirm = dynamic(() => import("../../components/Drawer/purchaseConfirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AddressDialog = dynamic(() => import("../../components/Dialog/AddressDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const Checkout = dynamic(() => import("../../components/Drawer/checkout"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AddHighlightStory = dynamic(() => import("../../components/Drawer/AddHighlightStory"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AddHighlightCover = dynamic(() => import("../../components/Drawer/AddHighlightCover"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AddHighlightEditCover = dynamic(() => import("../../components/Drawer/AddHighlightEditCover"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const EditHighlightStory = dynamic(() => import("../../components/Drawer/EditHighlightStory"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const HighlightStoryDialog = dynamic(() => import("../highlight-stories/highlight-story-dialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const HighlightStoryOptions = dynamic(() => import("../../components/Drawer/HighlightStoryOptions"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DeletePost = dynamic(() => import("../../components/Drawer/DeletePost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ReportPost = dynamic(() => import("../../components/Drawer/ReportPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DvPostSelection = dynamic(() => import("../../components/Dialog/postSelections"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DvCollection = dynamic(() => import("../../components/Dialog/collection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const EditCollection = dynamic(() => import("../../components/Dialog/editCollection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DeleteDialog = dynamic(() => import("./deleteDialog/deleteDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const BuyPostDialog = dynamic(() => import("../../components/Drawer/buyPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AddCoins = dynamic(() => import("../../components/Dialog/AddCoins"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const CoinsAddedSuccess = dynamic(() => import("../../components/Dialog/CoinsAddedSuccess"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const PurcahseNewPost = dynamic(() => import("../../components/Dialog/PurchaseNewPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SuccessPayment = dynamic(() => import("../../components/Dialog/SuccessPayment"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AddressList = dynamic(() => import("../../components/Drawer/AddressList"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const CancelSubscription = dynamic(() => import("../../components/Drawer/CancelSubscription"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ThumnailSelection = dynamic(() => import("../drawer/thumbnail-selectore/thumbnail-selectore"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const PostInsight = dynamic(() => import("../../components/Dialog/PostInsight"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const PopularUserSearch = dynamic(() => import("../../components/Drawer/PopularUserSearch"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const VipMessagePopup = dynamic(() => import("../../components/Drawer/VipMessagePopup"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const VipMessagePlans = dynamic(() => import("../../components/Drawer/VipMessagePlans"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const RecoverWarningDialog = dynamic(() => import("./recoverWarning/recoverWarningDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DeleteChatConfirmation = dynamic(() => import("./deleteChatConfirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const StoryViews = dynamic(() => import("../../components/Drawer/StoryViews"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DeleteSubPlanConfirm = dynamic(() => import("../../components/Drawer/subscription/DeleteSubPlanConfirm"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const CreatorPlanSubscription = dynamic(() => import("../../components/Drawer/subscription/CreatorPlanSubscription.jsx"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DvEditBio = dynamic(() => import("../DvEditProfile/DvEditBio"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const VdoDrawer = dynamic(() => import("../../components/Drawer/VdoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const CityDrawer = dynamic(() => import("../../components/Drawer/countryDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const UserCancelOrder = dynamic(() => import("./userCancelOrderAndPurchase/userOrder"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const OrderVideoShotOut = dynamic(() => import("./orderVideoShotOut/orderVideoShotOut"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const PlaceOrderStatus = dynamic(() => import("./placeOrderStatus/placeOrderStatus"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const Emoji = dynamic(() => import('../../components/Dialog/selectEmoji'), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const EditShoutoutPrice = dynamic(() => import("../profile/edit-profile/edit-shoutout-price"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const NSFW = dynamic(() => import("../../components/Drawer/NSFW"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const NSFW_SIGNUP = dynamic(() => import("../registration/model-registration/nsfw"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const UserInfoDrawer = dynamic(() => import("../drawer/LiveStreamVideo/userInfoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const StreamViewerList = dynamic(() => import("../drawer/LiveStreamVideo/streamViewerList"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const CancelStream = dynamic(() => import("../drawer/LiveStreamVideo/cancelStream"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const StreamSettingsDialog = dynamic(() => import("../drawer/LiveStreamVideo/streamSettings"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const StreamInfoDrawer = dynamic(() => import("../drawer/LiveStreamVideo/streamInfoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AttachedFile = dynamic(() => import("./attachedFIleDialog/attachedFileDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const UploadProgress = dynamic(() => import("./Loadings/uploadProgress"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const CreateBulkMessage = dynamic(() => import("../../components/Drawer/bulkMessage/createBulkMessage"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const BulkMessage = dynamic(() => import("../../components/Drawer/bulkMessage/bulkMessage"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AllLockedPosts = dynamic(() => import("../../components/Drawer/bulkMessage/locked_post"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SingleBulkMessage = dynamic(() => import("../../components/Drawer/bulkMessage/singleBulkMessage"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ProfileSubmitted = dynamic(() => import("../SignUpModel/SignUpModel2"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const PostDialog = dynamic(() => import("../../components/post/index"), { ssr: false, loading: () => <p>Loading...</p>, });
const PostEditDialog = dynamic(() => import("../../components/post/editPost"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SetDuration = dynamic(() => import("../../components/Drawer/videoCall/setDuration"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ProductTagging = dynamic(() => import("../../components/Drawer/videoCall/productTagging"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SetAddOverride = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/setAddOverride"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ChooseDateOverRideType = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/ChooseOverRideType"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ViewOverRideSlots = dynamic(() => import("../../components/Drawer/videoCall/dataOverride/ViewOverRideSlots"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SocialMediaLinks = dynamic(() => import("./socialMediaLinks/socialMediaLinks"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const EmojiDialog = dynamic(() => import("./selectEmoji"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const BulkMsgViewer = dynamic(() => import("../../components/Drawer/bulkMessage/BulkMsgViewer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const RateCreator = dynamic(() => import("./rateCreaterShoutout/rateCreator"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const DVCategory = dynamic(() => import("../../components/Drawer/DVcategory"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const VideoCallRequest = dynamic(() => import("../../components/Drawer/videoCall/videoCallRequest"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const VideoDevices = dynamic(() => import("../../containers/videoCall/conference/videoDevices"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const RollerTimePicker = dynamic(() => import("../../components/rollerTimePicker"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const VerifyId = dynamic(() => import("../../components/Dialog/VerifyId"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AddExtension = dynamic(() => import("../videoCall/addExtension"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const HomepageVideoDrawer = dynamic(() => import("../../components/Drawer/homePageVideoDrawer"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ShoutOut = dynamic(() => import("../../components/Dialog/shoutoutDesktop"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SuccessOnly = dynamic(() => import("./successOnly/successOnly"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SubSum = dynamic(() => import("../../components/SumSub/SumSub"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const PurchaseConfirmWallet = dynamic(() => import("../../components/Dialog/purchaseConfirmWallet"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SelectFolderDialog = dynamic(() => import("./vaultDialog/selectDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const RequestAgencymodal = dynamic(() => import("../../components/RequestAgencymodal"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const UnlinkAgency = dynamic(() => import("../../components/UnlinkAgency"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AgencyReason = dynamic(() => import("../agency/AgencyReason"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const AssignEmployee = dynamic(() => import("../agency/AssignEmployee"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const SelectEmployee = dynamic(() => import("../agency/SelectEmployee"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ChangeEmployee = dynamic(() => import("../agency/ChangeEmployee"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const VideoCallPriceSettings = dynamic(() => import("../../containers/videoCall/priceSection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ScheduleSection = dynamic(() => import("../../containers/videoCall/scheduleSection"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});
const ConfirmationDialog = dynamic(() => import("../../components/Drawer/confirmationDialog"), { ssr: false, loading: () => <p style={{textAlign: 'center', margin: '10px 20px'}}>Loading...</p>});

const ModalDialog = (props) => {
	let { dialogData } = props;
	console.log(props, "props")
	let dialogContent = () => {
		switch (props.type) {
			case "WalletFilter":
				return (
					<WalletFilters
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></WalletFilters>
				);
				break;

			case "confirmationDialog":
				return (
					<ConfirmationDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)

			case "AccAccepted":
				return (
					<AccAccepted
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.dialogData.dialogClick}
					></AccAccepted>
				);
				break;
			case "BookmarkSelections":
				return (
					<DvPostSelection
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.dialogData.dialogClick}
					/>
				);
				break;
			case "HomepageCommentBox":
				return (
					<HomepageCommentBox
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
				break;
			case "CommentOptions":
				return (
					<CommentOptions
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
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
			case "confirmDeleteMemeber":
				return (
					<DeleteConfirmMemeber
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></DeleteConfirmMemeber>
				);
				break;
			case "DeleteDialog":
				return (
					<DeleteDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></DeleteDialog>
				);
				break;

			case "MsgDialog":
				return (
					<MsgDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></MsgDialog>
				);
				break;

			case "SHARE_ITEMS":
				return (
					<ShareItems
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "SHARE_REFER":
				return (
					<ShareRefer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "Logout":
				return (
					<Logout
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "ChangePhoneNum":
				return (
					<DvEditPhoneNum
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></DvEditPhoneNum>
				);
				break;

			case "ChangePassword":
				return (
					<ChangePassword
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></ChangePassword>
				);
				break;

			case "successfullDialog":
				return (
					<ToasterDrawer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "ADDSocialMediaLinks":
				return (
					<SocialMediaLinks
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "confirmDialog":
				return (
					<ConfirmDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "DeactivateReasons":
				return (
					<DeactivateReasons
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></DeactivateReasons>
				);
				break;

			case "FrgtPass":
				return (
					<ForgotPassword
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></ForgotPassword>
				);
				break;

			case "FrgtPass1":
				return (
					<ForgotPassword1
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></ForgotPassword1>
				);
				break;

			case "faqContent":
				return (
					<FaqContent
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></FaqContent>
				);
				break;

			case "addAddress":
				return (
					<AddAddress
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "confirmDeleteAddress":
				return (
					<DeleteCardConfirm
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "videoCallSettings":
				return (
					<VideoCallPriceSettings
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "ScheduleSection":
				return (
					<ScheduleSection
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
				return (
					<DeleteCardConfirm
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "ChangeEmail":
				return (
					<DvEditEmail
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
						username={props.dialogData.username}
					/>
				);
				break;

			case "paymentSuccess":
				return (
					<PaymentSuccess
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></PaymentSuccess>
				);
				break;

			case "newCollection":
				return (
					<AddCollections
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></AddCollections>
				);
				break;
			case "editCollection":
				return (
					<EditCollection
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></EditCollection>
				);
				break;
			case "collection":
				return (
					<DvCollection
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "AddStripeAcc":
				return (
					<AddStripeAcc
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></AddStripeAcc>
				);
				break;

			case "AddBankAcc":
				return (
					<AddBankAcc
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></AddBankAcc>
				);
				break;

			case "Set_duration":
				return (
					<SetDuration
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></SetDuration>
				);
				break;

			case "Product_Tagging":
				return (
					<ProductTagging
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "videoCallRequest":
				return (
					<VideoCallRequest
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></VideoCallRequest>
				);
				break;

			case "changeVideoDevice":
				return (
					<VideoDevices
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "addExtensionVideo":
				return (
					<AddExtension
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "setAddOverride":
				return (
					<SetAddOverride
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></SetAddOverride>
				);
				break;

			case "chooseOverRideType":
				return (
					<ChooseDateOverRideType
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></ChooseDateOverRideType>
				);
				break;

			case "viewOverRideSlots":
				return (
					<ViewOverRideSlots
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></ViewOverRideSlots>
				);
				break;

			case "radioSelector":
				return (
					<SelectoreDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
				break;

			case "withdrawalInfo":
				return (
					<WithdrawalInfo
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></WithdrawalInfo>
				);
				break;

			case "DeleteUser":
				return (
					<DeleteUser
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></DeleteUser>
				);
				break;

			case "BlockedUser":
				return (
					<BlockedUser
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></BlockedUser>
				);
				break;

			case "followers":
				return (
					<FollowFollowing
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></FollowFollowing>
				);
				break;

			case "COMMENT":
				return (
					<CommentBox
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></CommentBox>
				);
				break;

			case "sendTip":
				return (
					<SendTipDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "RequestTip":
				return (
					<RequestTip
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "purchaseConfirm":
				return (
					<PurchaseConfirm
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "addressDialog":
				return (
					<AddressDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "Address":
				return (
					<AddressList
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "checkout":
				return (
					<Checkout
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "ADD_HIGHLIGHT_STORY":
				return (
					<AddHighlightStory
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></AddHighlightStory>
				);
				break;
			case "ADD_HIGHLIGHT_COVER":
				return (
					<AddHighlightCover
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></AddHighlightCover>
				);
				break;
			case "ADD_HIGHLIGHT_EDIT_COVER":
				return (
					<AddHighlightEditCover
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></AddHighlightEditCover>
				);
				break;

			case "EDIT_HIGHLIGHT_STORY":
				return (
					<EditHighlightStory
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></EditHighlightStory>
				);
				break;

			case "HIGHLIGHT_STORY":
				return (
					<HighlightStoryDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></HighlightStoryDialog>
				);
				break;

			case "HIGHLIGHT_STORY_OPTIONS":
				return (
					<HighlightStoryOptions
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></HighlightStoryOptions>
				);
				break;

			case "DeletePost":
				return (
					<DeletePost
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></DeletePost>
				);
				break;

			case "REPORT_POST":
				return (
					<ReportPost
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></ReportPost>
				);
				break;

			case "buyPost":
				return (
					<BuyPostDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "addCoins":
				return (
					<AddCoins
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "coinsAddedSuccess":
				return (
					<CoinsAddedSuccess
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "purchaseNewPost":
				return (
					<PurcahseNewPost
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "successPayment":
				return (
					<SuccessPayment
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "addCard":
				return (
					<AddCard
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "drawerToaster":
				return (
					<ToasterDrawer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "cancelSubscription":
				return (
					<CancelSubscription
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></CancelSubscription>
				);
				break;

			case "thumbSelectore":
				return (
					<ThumnailSelection
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "POST_INSIGHT":
				return (
					<PostInsight
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "search":
				return (
					<PopularUserSearch
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "VIP_MESSAGE_PLANS":
				return (
					<VipMessagePlans
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "VIP_MESSAGE_POPUP":
				return (
					<VipMessagePopup
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "DELETE_CHAT":
				return (
					<RecoverWarningDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "deleteChatConfirm":
				return (
					<DeleteChatConfirmation
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "STORY_VIEWS":
				return (
					<StoryViews
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;
			case "DeleteSubPlanConfirm":
				return (
					<DeleteSubPlanConfirm
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
				break;

			case "CreatorPlanSubscription":
				return (
					<CreatorPlanSubscription
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "ChangeBio":
				return (
					<DvEditBio
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					></DvEditBio>
				);

			case "VDO_DRAWER":
				return (
					<VdoDrawer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "HOMEPAGE_VIDEO_DRAWER":
				return (
					<HomepageVideoDrawer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "cityDrawer":
				return (
					<CityDrawer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "my_orders":
				return (
					<UserCancelOrder
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
			case "upload_order_video":
				return (
					<OrderVideoShotOut
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
			case "place_order_status":
				return (
					<PlaceOrderStatus
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
			case "emoji":
				return (
					<Emoji
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);
			case "EDIT_SHOUTOUT_PRICE":
				return (
					<EditShoutoutPrice
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "NSFW":
				return (
					<NSFW
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "NSFW_Signup":
				return (
					<NSFW_SIGNUP
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>);
			case "USER_INFO_POPUP":
				return (
					<UserInfoDrawer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "STREAM_VIEWER_LIST":
				return (
					<StreamViewerList
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "LiveStreamCancel":
				return (
					<CancelStream
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "STREAM_INFO_POPUP":
				return (
					<StreamInfoDrawer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "STREAM_SETTINGS":
				return (
					<StreamSettingsDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "POST_DIALOG":
				return (
					<PostDialog
						mode='create'
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)

			case "POST_EDIT_DIALOG":
				return (
					<PostDialog
						mode='edit'
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)

			case "attachedFile":
				return (
					<AttachedFile
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "withdrawMoney":
				return (
					<WithdrawMoneyDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "WithdrawWingspanMoney":
				return (
					<WithdrawWingspanMoneyDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "WithdrawChargeDetails":
				return (
					<WithdrawChargeDetails
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "WithdrawSuccessInfo":
				return (
					<WithdrawSuccessInfo
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "WingspanSetupDialog":
				return (
					<WingspanSetupDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "TransactionHistoryDetails":
				return (
					<TransactionHistoryDetails
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "UPLOAD_PROGRESS":
				return (
					<UploadProgress
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "bulkMessage":
				return (
					<BulkMessage
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "createBulkMessage":
				return (
					<CreateBulkMessage
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "allLockedPost":
				return (
					<AllLockedPosts
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "singleBulkMessage":
				return (
					<SingleBulkMessage
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "profileSubmitted":
				return (
					<ProfileSubmitted
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "emojiDialog":
				return (
					<EmojiDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "rollerTimePicker":
				return (
					<RollerTimePicker
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "bulkMsgViewer":
				return (
					<BulkMsgViewer
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "rateCreator":
				return (
					<RateCreator
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "category":
				return (
					<DVCategory
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);

			case "documentVerification":
				return (
					<VerifyId
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				);
			case "open_desktop_shoutout":
				return (
					<ShoutOut
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "successOnly":
				return (
					<SuccessOnly
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				);

			case "timeZone":
				return (
					<TimeZone
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				)
			case "juicyTimeZone":
				return (
					<JuicyTimeZone
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose}
					/>
				)
			case "hashTagPopup":
				return (
					<HashTagPopup {...props.dialogData} />
				)

			case "PostSlider":
				return (
					<PostSlider {...props.dialogData} />
				)
			case "MoreSideNav":
				return (
					<DVmoreSideBar
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "RequestAgencymodal":
				return (
					<RequestAgencymodal
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "UnlinkAgency":
				return (
					<UnlinkAgency
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "RequestAgencymodal":
				return (
					<RequestAgencymodal
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "UnlinkAgency":
				return (
					<UnlinkAgency
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)


			case "SumSub":
				return (
					<SubSum {...props.dialogData} />
				)

			case "purchaseConfirmWallet":
				return (
					<PurchaseConfirmWallet
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)

			case "renameFiles":
				return (
					<RenameFolderDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)

			case "deleteFiles":
				return (
					<DeleteFolderDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)

			case "selectFiles":
				return (
					<SelectFolderDialog
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "createNew":
				return (
					<CreateType
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "S3Uploader":
				return (
					<S3Upload
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "AttachVaultMedia":
				return (
					<AttachVaultMedia
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)

			case "createCustomerLists":
				return (
					<CreateCustomerLists
						{...props.dialogData}
						handlerDialog={props.handlerDialog}
						onClose={props.handleClose.bind(null, props.type)}
					/>
				)
			case "reasonAgency":
				return (
					<AgencyReason {...props.dialogData} />
				)
			case "assignEmployee":
				return (
					<AssignEmployee {...props.dialogData} />
				)
			case "changeEmployee":
				return (
					<ChangeEmployee {...props.dialogData} />
				)
			case "selectAgency":
				return (
					<SelectEmployee
						{...props.dialogData}
					/>
				)
			case "chatNotes":
				return <ChatNotes
					{...props.dialogData}
					onClose={props.handleClose.bind(null, props.type)}
				/>

			default:
				return <div>empty</div>;
		}
	};
	// let dialogContent = () => {
	//   switch (props.type) {
	//     case "WalletFilter":
	//       return <h1>demo</h1>;
	//       break;
	//     default:
	//       return <div>empty</div>;
	//   }
	// };

	// To stop Backdrop Click just paste below line to your dialog props
	// onBackdropClick: true,
	return (
		//dialog component
		<Dialog
			test="dialog"
			open={props.open}
			onBackdropClick={(e) => {
				dialogData?.onBackdropClick
					? false
					: dialogData && dialogData.dialogClick
						? dialogData.dialogClick(e)
						: props.handleClose(e);
			}}
			// className={`${classes.outerBox} ${dialogData && dialogData.outerBox} mu-dialog ${props.type} ${props.isVisible ? "" : "d-none"}`}
			className={`${dialogData && dialogData.outerBox} mu-dialog ${props.type}`}
			onClose={props.handleClose}
			// disableBackdropClick={props.disableBackdropClick}
			disableBackdropClick={dialogData?.onBackdropClick}
			PaperProps={{ className: props.type }}
			disableEnforceFocus={props.dialogData?.disableEnforceFocus ? true : false}
			{...props.dialogModel}
		>
			<DialogContent test="DialogContent" className={`specific_section_bg targetDialog`} id="dialogMain">
				<div className=" btmModal w-100 h-100 popup ">{dialogContent()}</div>
			</DialogContent>
			<style jsx>{`
				:global(.mu-dialog > div > div) {
					overflow-y: visible !important;
					border-radius: 12px !important;
				}
				:global(.mu-dialog) {
					margin: 11px !important;
				}
				:global(.MuiDialog-paper) {
					min-width: ${props.type === "POST_INSIGHT" ? "800px" : "450px"};
				}
				@media only screen and (max-width: 767px) {
					:global(.mu-dialog > div > div) {
						max-width: 90vw !important;
					}
					:global(.MuiDialog-paper) {
						min-width: auto !important;
					}
				}
				:global(.MuiDialog-paperWidthSm){
					max-width: ${props.type === "addAddress" && "500px"};
					border-radius: 12px;
				}
				:global(.MuiDialogContent-root){
					padding: 0px !important;
					overflow-x: hidden;
					border-radius: 12px !important;
				}
				:global(.mu-dialog .MuiPaper-root) {
					background-color: var(--l_profileCard_bgColor);
				}
			`}</style>
		</Dialog>
	);
};

export default ModalDialog;
