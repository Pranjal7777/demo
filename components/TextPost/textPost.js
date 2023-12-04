import { close_dialog, close_drawer, open_dialog, open_drawer } from "../../lib/global/loader";
import { authenticate } from "../../lib/global/routeAuth";
import isMobile from "../../hooks/isMobile";
import {
  DOLLAR_ICON,
  DV_Sent_Tip,
  IMAGE_LOCK_ICON,
  UNLOCK_ICON,
} from "../../lib/config/homepage";
import Img from "../ui/Img/Img";
import { getCookie } from "../../lib/session";
import Icon from "../image/icon";
import { useTheme } from "react-jss";
import useLang from "../../hooks/language"
import { useRouter } from "next/router";
import { defaultCurrency, isAgency } from "../../lib/config/creds";
import { authenticateUserForPayment } from "../../lib/global";

/**
 * @description Image slider for Cloudinary images ( using in timeline Posts )
 * Old Code By
 * @author Jagannath
 * @date 2020-12-15
 * @param props{
 *  imagesList: object[] - array of object containing "url" key [{url: ""}]
 *
 *  transitionMs: int - default 400 ms
 *
 *  enableAutoPlay: boolean - default false
 * }
 *
 */

const TextPost = (props) => {
  const router = useRouter()
  const {
    textPost,
    transitionMs,
    isVisible,
    enableAutoPlay,
    updatePostPurchase,
    updateTipHandler,
    postType,
    userId,
    fromHashtag,
    ...others
  } = props;
  const [mobileView] = isMobile();
  const [lang] = useLang()
  const uid = getCookie("uid");
  const theme = useTheme();

  const handlePurchasePost = (data = {}) => {
    authenticate().then(() => {
      mobileView
        ? open_drawer("buyPost", {
          creatorId: props.userId,
          postId: props.postId,
          price: props.price,
          currency: (props.currency && props.currency.symbol) || "$",
          updatePostPurchase,
          postType: props.postType,
          chatId: props.chatId,
        },
          "bottom"
        )
        : open_dialog("buyPost", {
          creatorId: props.userId,
          postId: props.postId,
          price: props.price || 0,
          currency:
            (props.currency && props.currency.symbol) ||
            defaultCurrency,
          updatePostPurchase,
          postType: props.postType,
          chatId: props.chatId,
        });
    });
  };

  const handleSubscribeDrawer = () => {
    authenticate().then(() => {
      mobileView
        ? open_drawer("CreatorPlanSubscription", {
          back: () => close_drawer(),
          creatorId: props.userId,
          creatorName: props.profileName,
          subscribedEvent: props.subscribedEvent,
        },
          "bottom"
        )
        : open_dialog("CreatorPlanSubscription", {
          back: () => close_dialog(),
          creatorId: props.userId,
          creatorName: props.profileName,
          subscribedEvent: props.subscribedEvent,
        });
    })
  };

  return (
    <>
      <div style={{ height: `${props.height ? props.height : "100%"}`, minHeight: fromHashtag ? "" : !mobileView ? "28vh" : "" }}>
        {textPost && textPost.length > 0 &&
          textPost.map((item, i) => {
            return (!isVisible && postType != 3 && userId != uid)
              ? <div style={{ height: "100%" }} key={i}>
                <div
                  key={i}
                  className="text-post-container blur__image"
                  style={{
                    minHeight: '100%',
                    maxHeight: '28vh',
                    wordBreak: 'break-word',
                    color: `${item?.colorCode}`,
                    background: `${item?.bgColorCode}`,
                    fontFamily: `${item?.font}`,
                    justifyContent: `${item?.textAlign}`,
                    fontSize: `${item?.text?.length > 250 ? '1.5vw' : item?.text?.length > 200 ? '2vw' : item?.text?.length > 100 ? '3vw' : item?.text?.length > 50 ? '3.5vw' : '4.5'}`
                  }}
                >
                  {item?.text}
                </div>
                <div
                  onClick={postType == 1 && !isVisible ? handlePurchasePost : postType == 2 && !isVisible ? handleSubscribeDrawer : () => { }}
                  // style={{ position: "relative", width: "100%" }}
                  className={`${!isVisible ? "cursorPtr" : ""}`}
                >
                  {props?.tileLockIcon ? (
                    ""
                  ) : (
                    <div style={props?.billingScreen
                      ? {
                        position: "absolute",
                        top: "50%",
                        left: "45%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                      }
                      : {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                        textAlign: "center"
                      }
                    }>
                      <Icon
                          icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                          color={theme.palette.white}
                          size={props?.billingScreen || postType == 5
                            ? 35
                            : mobileView ? 50 : props.size ? props.size : 100}
                          unit="px"
                          viewBox="0 0 68.152 97.783"
                        />
                      {props.postType == 1 && !props.isVisible && !props.exploreMobile ? (
                          <span className={`btn btn-default px-3 py-2 buy_post_btn font-weight-bold mt-2 ${props.adjustUnlockSubscribetext && "adjustUnlockSubscribetext"}`}>
                          {lang.unlockPostFor}
                          {props?.currency?.symbol || "$"}
                          {props.price || "0.00"}
                        </span>
                      ) : ""}
                    </div>
                  )}
                </div>
              </div>
              : <div
                key={i}
                className="text-post-container managerTextPost"
                style={{
                  wordBreak: 'break-word',
                  color: `${item?.colorCode}`,
                  background: `${item?.bgColorCode}`,
                  fontFamily: `${item?.font}`,
                  justifyContent: `${item?.textAlign}`,
                  maxHeight: "28vh",
                  overflowY: "scroll",
                  minHeight: '100%',
                  cursor: "pointer",
                  textAlign: `${item?.textAlign}`,
                  fontSize: `${mobileView
                    ? item?.text?.length > 250 ? '3vw' : item?.text?.length > 200 ? '3.2vw' : item?.text?.length > 100 ? '3.5vw' : item?.text?.length > 50 ? '3.7vw' : '4.5vw'
                    : item?.text?.length > 250 ? '1vw' : item?.text?.length > 200 ? '1.5vw' : item?.text?.length > 100 ? '2vw' : item?.text?.length > 50 ? '2.5vw' : '3vw'
                    }`
                }}
              >
                {item.text}
              </div>
          })}
      </div>

      <div className={mobileView ? "" : "dv__tipSec d-flex align-items-center"}>

        {props.postType == 1 && props.userId != uid && !props.isGridView && (
          <div onClick={!isVisible ? handlePurchasePost : ""}>
            {!isVisible ? "" : (
              <div className={`btn btn-default py-1 d-flex align-items-center ${mobileView ? "ml-2 btn_price_tag" : "dv__btn_price_tag"
                } `}>
                <Img src={UNLOCK_ICON} width={16} alt="lock" className="p-1" />
                <div className="ml-1 fntSz12 w-600">{lang.unlocked}</div>
              </div>
            )}
          </div>
        )}


        {props.showPriceOnGrid && (props.postType == 1 || props.postType == 4) && props.isVisible 
          ? <div className="">

            <div className={`${props.postType == 1 && props.userId != uid && !props.isGridView && props.isVisible ? "purchasedPrice" : "purchasedPriceNonUnlocked"}  dv__sendTip d-flex align-items-center px-2 py-1 ml-auto`} style={{ width: mobileView ? '17vw' : '5vw' }}>
              <Icon
                icon={`${DOLLAR_ICON}#Dollar_tip`}
                color={theme.palette.white}
                size={16}
                class="d-flex align-items-center"
                viewBox="0 0 20 20"
              />
              <span className="txt-heavy ml-2 fntSz12">
                {props.price}
              </span>
            </div>
          </div>
          : ""}

        {router.pathname === "/search" &&
          props.userId != uid && !mobileView && (
            <div
              className={`${!isVisible && props.postType == 1 ? "" : "dv__sendTip"} cursorPtr mx-2 p-2`}
              onClick={() => {
                authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
                  !isAgency() && authenticate().then(() => {
                    if (!isVisible && props.postType == 1) {
                      open_dialog("buyPost", {
                        creatorId: props.userId,
                        postId: props.postId,
                        price: props.price || 0,
                        currency:
                          (props.currency && props.currency.symbol) ||
                          defaultCurrency,
                        updatePostPurchase,
                        postType: props.postType,
                      });
                    } else {
                      open_dialog("sendTip", {
                        creatorId: props.userId,
                        postId: props.postId,
                        updateTip: (tipCount) =>
                          updateTipHandler && updateTipHandler(tipCount),
                      });
                    }
                  });
                })
              }}
            >
              {!isVisible && props.postType == 1 ? "" : (
                <div className="d-flex pb-1">
                  <Icon
                    icon={`${DV_Sent_Tip}#_Icons_11_Dollar_2`}
                    color={theme.palette.l_app_bg}
                    viewBox="0 0 20 20"
                  />
                  <span className="txt-heavy ml-2 dv__fnt14 pt-1">{lang.sendTip}</span>
                </div>
              )}
            </div>
          )}
      </div>
      <style>{`
                img{
                    object-fit:contain;
                }
                .text-post-container {
                    word-break: break-word;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    padding: 10px;
                    text-align: center;
                    border-radius:4px;
                    
                }
                .text-post-container::-webkit-scrollbar { 
                  display: none !important;
              }
                .blur__image {
                    -webkit-filter: blur(4px); 
                    filter: blur(3px);
                }
                // .purchasedPrice{
                //   position: absolute;
                //   bottom: 0px;
                //   left: 0px;
                //   height: 28px;
                // }
              .purchasedPriceNonUnlocked{
                position: absolute;
                bottom: 1px;
                left: 1px;
                height: 28px;
              }

            `}</style>
    </>
  );
};
export default TextPost;