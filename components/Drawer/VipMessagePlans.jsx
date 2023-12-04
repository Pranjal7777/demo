import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { result } from '../../fixtures/moc-data/vip-message-plans'
import useReduxData from '../../hooks/useReduxState';
import useProfileData from '../../hooks/useProfileData';
import Route from 'next/router';
import { DIAMOND_COLOR, backArrow, backArrow_lightgrey, defaultCurrency } from '../../lib/config'
import { authenticateUserForPayment, close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader, Toast } from '../../lib/global';
import { getAddress } from '../../redux/actions';
import useLang from '../../hooks/language';
import isMobile from '../../hooks/isMobile';
import { getVipMessagePlansApi, purchaseVipMessageApi } from '../../services/chat';
import usePg from '../../hooks/usePag';
import dynamic from 'next/dynamic';
const PaginationIndicator = dynamic(() => import('../pagination/paginationIndicator'), { ssr: false });
const Skeleton = dynamic(() => import('@material-ui/lab/Skeleton'), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import Icon from '../image/icon';
import { useUserWalletBalance } from '../../hooks/useWalletData';
import { purchaseSuccessFromWallet } from '../../redux/actions/wallet';
import { CoinPrice } from '../ui/CoinPrice'
import Img from '../ui/Img/Img';
import { startChat } from '../../lib/chat';
import { getProfile } from '../../services/auth';
import { getCookie } from '../../lib/session';

const VipMessagePlans = (props) => {
  const theme = useTheme();
  const [pg] = usePg();
  const [planData, setPlanData] = useState([]);
  const [totalPlans, setTotalPlans] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [chatData, setChatData] = useState(null);
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
  const [userWalletBalance] = useUserWalletBalance()
  const [profile] = useProfileData()

  useEffect(() => {
    getVipMessagePlans();
    setChatData(localStorage.getItem("chatData"));
  }, []);

  const featureDesc = () => (
    <div className="col-12 mb-3">
      <p className={`${mobileView ? "feature__desc" : "fntSz18"} text-center`}>
        {lang.vipMsgPlan}
      </p>
    </div>
  );

  const plans = () => (
    <div className='col-12 pb-3 scrollbar_hide' style={{ height: "38vh", overflowY: "scroll" }}>
      {planData.length ? (
        planData.map((item) => {
          return (
            <div key={item._id} onClick={() => setSelectedPlan(item)}>
              <Button
                fixedBtnClass={item._id == selectedPlan._id ? "active" : "inactive"}
                style={{ marginBottom: "20px" }}
              >
                <div className="col-8 text-left d-flex">

                  <Img
                    src={DIAMOND_COLOR}
                    width={20}
                    className="mr-1"
                    alt="Vip chat user icon"
                  />
                  <div className='mb-0 ml-1'>{lang.for} {item.numberOfMsg || 0} {lang.messages}</div>
                </div>
                <div className="col-4 text-right d-flex justify-content-end">
                  {/* {(item.currency && item.currency.symbol) || defaultCurrency} */}
                  <CoinPrice displayStyle={'flex'} price={item.amount || 0} showCoinText={false} iconSize='20' />

                </div>
              </Button>
            </div>
          );
        })
      ) : (
        <>
          {[...Array(2)].map((val, index) => (
            <div className="my-2" key={index}>
              <Skeleton
                variant="rect"
                width={400}
                height={50}
                animation="wave"
                className="m-auto"
              />
            </div>
          ))}
        </>
      )}
    </div>
  );

  const getVipMessagePlans = (pageCount = 0) => {
    const list = {
      limit: 10,
      offset: pageCount * 10,
    };
    getVipMessagePlansApi(list)
      .then((res) => {
        if (res && res.data && res.data.data) {
          const result = res.data.data;
          if (!pageCount) {
            setPlanData(result.data);
            setSelectedPlan(result.data[0] || {});
          } else {
            setPlanData((prev) => [...prev, ...result.data]);
          }
          setTotalPlans(result.totalCount);
          setPage((p) => p + 1);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("error", error);
      });
  };

  const handleGetAddress = async () => {
    await dispatch(getAddress({ loader: true }));
  };

  const handlePurchaseSuccess = () => {
    mobileView ? open_drawer("coinsAddedSuccess", {}, "bottom") : open_dialog("coinsAddedSuccess", {})
  }

  const handleContinue = (e) => {
    e.preventDefault();
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
      if (userWalletBalance < selectedPlan.amount) {
        mobileView ? open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") :
          open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess })
        return
      }
      if (reduxData.defaultCard) {
        mobileView
          ? open_drawer("purchseConfirmDialog", {
            title: <div>
              <h4 className='my-3 text-center'>Confirm Purchase</h4>
              <CoinPrice price={selectedPlan.amount} showCoinText={false} prefixText={lang.confirmTxt + ` ${selectedPlan.numberOfMsg} VIP messages for`} />
            </div>,
            desc: <p className='text-center mb-0'>{lang.defaultWallet}</p>,
            checkout: handlePurchasePlan,
            price: selectedPlan.amount,
            handlePaymentUsingWallet: true,
            isApplyPromo: true,
            isVipMsgPlan: true,
            applyOn: "VIP_PLAN",
            creatorId: props.creatorId
          }, "bottom")
          : open_dialog("purchaseConfirm", {
            title: <div>
              <h4 className='my-3 text-center'>Confirm Purchase</h4>
              <CoinPrice price={selectedPlan.amount} showCoinText={false} prefixText={lang.confirmTxt + ` ${selectedPlan.numberOfMsg} VIP messages for`} />
            </div>,
            desc: <p className='text-center mb-0'>{lang.defaultWallet}</p>,
            handlePaymentUsingWallet: true,
            checkout: handlePurchasePlan,
            closeAll: false,
            isVipMsgPlan: true,
            price: selectedPlan.amount,
          });
      } else {
        handleGetAddress(),
          mobileView
            ? open_drawer(
              "checkout",
              {
                title: `${lang.confirmTxt} ${selectedPlan.currency &&
                  <CoinPrice price={selectedPlan.amount} showCoinText={false} />
                  }(${selectedPlan.numberOfMsg} messages)`,
                desc: lang.defaultBillingAddress,
                onClose: Route.back,
                getAddress: handleGetAddress,
                radio: true,
                checkout: handlePurchasePlan,
                price: selectedPlan.amount,
                isApplyPromo: true,
                applyOn: "VIP_PLAN",
                creatorId: props.creatorId
              },
              "right"
            )
            : open_dialog("checkout", {
              title: `${lang.confirmTxt} ${selectedPlan.currency &&
                <CoinPrice price={selectedPlan.amount} showCoinText={false} />
                }(${selectedPlan.numberOfMsg} messages)`,
              desc: lang.defaultBillingAddress,
              onClose: props.onClose,
              getAddress: handleGetAddress,
              radio: true,
              checkout: handlePurchasePlan,
              price: selectedPlan.amount,
              isApplyPromo: true,
              applyOn: "VIP_PLAN",
              creatorId: props.creatorId
            });
      }
    })
  };

  const handlePurchasePlan = async (paymentMethod, addressId) => {
    startLoader();
    let chat = JSON.parse(chatData);
    let convoId = "";
    if (!convoId) {
      try {
        const profileRes = await getProfile(props.creatorId || props?.withChatUserId, getCookie('token'), getCookie('selectedCreatorId'))
        const profileData = profileRes.data?.data;
        let convo = await startChat({ userId: profileData.isometrikUserId, userName: profileData.username, userProfileImage: "/default-pic.png", searchableTags: [profile.username, profileData.username] }, true)
        convoId = convo?.conversationId;
      }
      catch (e) {
        Toast("somethig went wrong")
        return
      }
    }
    const payload = {
      planId: selectedPlan._id,
      chatId: convoId,
      opponentUserId: props.creatorId || props?.withChatUserId,
    };
    if (addressId) {
      payload["addressId"] = addressId;
    }
    purchaseVipMessageApi(payload)
      .then((res) => {
        // console.log('vipchat payload', props.chatId)
        if (res) {
          let vipChat = {
            chatCount: selectedPlan.numberOfMsg,
            chatId: props.chatId,
            isVip: true,
          };
          dispatch(purchaseSuccessFromWallet(+selectedPlan.amount))
          mobileView ? open_drawer("successPayment", { successMessage: res.data.message }, "bottom") : open_dialog("successPayment", { successMessage: res.data.message })
          setTimeout(() => {
            if (!props.noRedirect) {
              Route.push('/chat?c=' + convoId)
            } else {
              props.handleSubmit(res)
            }

            mobileView ? close_drawer() : close_dialog();
          }, 2000)
        }
        stopLoader();
      })
      .catch((error) => {
        // console.log('vipchat-error', error)
        stopLoader();
        Toast(
          (error && error.response && error.response.message) ||
          lang.msgPlanFailed,
          "error"
        );
      });
  };
  return (
    <div className='py-3'>
      {mobileView ? (
        <div id="vip_chat_plans" className="scr bg-dark-custom" style={{ overscrollBehavior: "contain" }}>
          <PaginationIndicator
            id="vip_chat_plans"
            pageEventHandler={async () => {
              if (
                !isLoading &&
                page &&
                planData &&
                planData.length < totalPlans
              ) {
                // console.log('.......')
                setLoading(true);
                getVipMessagePlans(page);
              }
            }}
          />
          <div className="col-12 py-3">
            <Icon
              icon={`${backArrow}#left_back_arrow`}
              color={theme.type == "light" ? "#000" : "#fff"}
              width={25}
              height={25}
              onClick={props.onClose}
              alt="backArrow"
            />
          </div>

          <div className="col-12 mb-3">
            <h4 className="subscription_title mb-0 fntSz22 text-center">{lang.buyVIPMsg}</h4>
          </div>

          {featureDesc()}
          {plans()}
          {mobileView ? <div className="posBtm">
            <Button
              onClick={handleContinue}
              role="button"
              type="button"
              fixedBtnClass={"active"}
            >
              {lang.continue}
            </Button>
          </div> : ""}
        </div>
      ) : (
        <div className="py-4 px-3">
          <div className="text-center pb-3">
            <h4 className="txt-black dv__fnt28">{lang.buyVIPMsg}</h4>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>

          {featureDesc()}
          {plans()}
          {<div className="pt-3">
            <Button
              onClick={handleContinue}
              role="button"
              type="button"
              fixedBtnClass={"active"}
            >
              {lang.continue}
            </Button>
          </div>}
        </div>
      )}
      <style jsx>
        {
          `:global(.coinprice) {
            text-align: center;
          }`
        }
      </style>
    </div>
  );
};

export default VipMessagePlans;

// VipMessagePlans.getInitialProps = async ({ctx}) => {
//     const { query = {}, req, res } = ctx;
//     const planData = result.result;
//     const totalCount = result.totalCount;
//     return {
//         plans: planData,
//         query: query,
//         totalPlans: totalCount
//     }
// }
