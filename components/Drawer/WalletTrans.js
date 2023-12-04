import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";

import {
  open_dialog,
  open_drawer,
  stopLoader,
} from "../../lib/global";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import useWalletData from "../../hooks/useWalletData";
import { getCreatorTransactions, getTransactions, getWithdrowLogs } from "../../services/payments";
import TranjectionItems from "../transaction/transactionItems";
import isMobile from "../../hooks/isMobile";
import Wrapper from "../../hoc/Wrapper";
import CustomDataLoader from "../loader/custom-data-loading";
import { getWallet } from "../../redux/actions";
import useProfileData from "../../hooks/useProfileData";
import CustomTooltip from "../customTooltip";
import { isAgency } from "../../lib/config/creds";
import { getCookie } from "../../lib/session";
import PaginationIndicator from "../pagination/paginationIndicator";
import { withdrawTransaction } from "../../lib/rxSubject";

const Button = dynamic(() => import("../button/button"), { ssr: false });
const Icon = dynamic(() => import("../image/icon"), { ssr: false });

export default function WalletTrans(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [wallet] = useWalletData();
  const [transactions, setTransaction] = useState(null);
  const dispatch = useDispatch();
  const [pageState, setPageState] = useState("");
  const [profileData] = useProfileData();
  const agencyId = getCookie("agencyId");
  const [loader, setLoader] = useState(false);
  const divRef = useRef(null);
  const [selectedFilter, setFilterSelected] = useState({
    value: 0,
    label: "All Transactions",
    name: "transactions",
  });
  const filters = [
    { value: 0, label: "All Transactions", name: "transactions" },
    { value: 1, label: "Credit Transactions", name: "transactions" },
    { value: 2, label: "Debit Transactions", name: "transactions" },
  ];
  const [mobileView] = isMobile();
  const [hasMore, setHasMore] = useState(true)

  const scrollToTop = () => {
    if (divRef.current) {
      divRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    scrollToTop()
    setHasMore(true)
    if (!loader && wallet?.walletData) {
      getUserTransactions(0, false);
    }
  }, [selectedFilter, props?.activeLink]);

  useEffect(() => {
    const transactionCall = withdrawTransaction.subscribe((params) => {
      if (params.isApicall) {
        dispatch(getWallet())
        getUserTransactions(0, false);
      }
    })
    return () => transactionCall.unsubscribe();
  }, [])

  const getUserTransactions = async (page, loader = false) => {
    return new Promise(async (res, rej) => {
      let txnType = 0;
      const walletId =
        wallet?.walletData[0]?.walletid;
      const newpageState = !loader ? "" : pageState;
      setLoader(true)
      try {
        // !loader && startLoader();
        const txnState = props?.activeLink === "available" ? "1" : props?.activeLink === "pending" ? "2" : "0";
        let data;
        let userType = isAgency() ? "agency" : "user"
        let userId = isAgency() ? agencyId : profileData?._id
        let txnType = props?.activeLink === "pending" ? 0 : selectedFilter.value;
        if (props?.activeLink === "history") {
          data = await getWithdrowLogs(userId, newpageState, userType, 10)
        } else {
          profileData?.userTypeCode !== 1 ? data = await getCreatorTransactions(
            userId,
            newpageState,
            10,
            txnType,
            txnState,
            userType
          ) :
            data = await getTransactions(
              walletId,
              newpageState,
              10,
              txnType
            );
        }
        if (data?.status === 200) {
          if (!data.data.data.pageState) setHasMore(false)
          // dispatch(getWallet())
          let newTransaction = data?.data?.data?.data;
          let oldTransaction = transactions && page != 0 ? transactions : [];
          setTransaction([...oldTransaction, ...newTransaction]);
          setPageState(data?.data?.data?.pageState);
          setLoader(false)
        } else if (data?.status === 204) {
          setTransaction([]);
          setPageState();
          setLoader(false);
        }
        stopLoader();
        res();
      } catch (e) {
        console.error("Sdsadad", e);
        setTransaction([]);
        setPageState();
        stopLoader();
        setLoader(false)
        rej();
      }
    });
  };

  const handleTransactionDetails = (itms) => {
    if (props?.activeLink === "history") {
      mobileView ? open_drawer("withdrawalInfo", {
        ...itms
      }, "bottom")
        : open_dialog("withdrawalInfo", {
          ...itms
        })
    } else {
      mobileView
        ? open_drawer("paymentSuccess", {
          id: itms.transactionid || itms.txnid,
          type: env.WITHDRAWAL_TRIGGER[itms.trigger],
          rechargeMode: itms.description,
          amount: itms.amount,
          currency: itms.currency,
          text: itms.description,
          time: moment(itms.txntimestamp).format(
            "MMM DD YY ,h:mm a"
          ),
          mobileView: mobileView,
          orderId: itms.orderid,
          txntype: itms.txntype,
          theme: theme,
          trigger: itms.trigger,
        },
          "right"
        )
        : open_dialog("paymentSuccess", {
          id: itms.transactionid || itms.txnid,
          type: env.WITHDRAWAL_TRIGGER[itms.trigger],
          rechargeMode: itms.description,
          amount: itms.amount,
          currency: itms.currency,
          text: itms.description,
          time: moment(itms.txntimestamp).format(
            "MMM DD YY ,h:mm a"
          ),
          mobileView: mobileView,
          orderId: itms.orderid,
          txntype: itms.txntype,
          theme: theme,
          trigger: itms.trigger,
        });
    }
  }

  return (
    <Wrapper>
      <div
        className={
          mobileView
            ? "h-100 flex flex-column overflow-hidden"
            : "h-100 flex flex-column px-0 py-2 overflow-hidden"
        }
      >
        <div className="col-12 py-1">
          <div className="row m-0 d-flex align-items-center justify-content-between">
            <p className="col-12 px-0 mb-2 fntSz15 text-app d-flex align-items-center">
              {lang.recentTransactions}
              {["available", "pending"].includes(props.activeLink) && profileData?.userTypeCode !== 1 &&
                <CustomTooltip
                  placement="top"
                  tooltipTitle={props.activeLink === "available" ? lang.activeTransanctionInfo : lang.pendingTransactionInfo}
                />}
            </p>
            {props.activeLink === "available" && <div className="d-flex justify-content-center flex-row">
              <div className="mr-2">
                <Button
                  type="button"
                  fclassname={`font-weight-500 px-4 py-2 rounded-pill background_none ${selectedFilter.value === 0 ? "border1pxSolid" : "borderStroke"}`}
                  btnSpanClass={selectedFilter.value === 0 ? "gradient_text" : ""}
                  onClick={() => setFilterSelected(filters[0])}
                  children={'All'}
                />
              </div>
              <div className="mr-2">
                <Button
                  type="button"
                  fclassname={`font-weight-500 px-4 py-2 rounded-pill background_none ${selectedFilter.value === 1 ? "border1pxSolid" : "borderStroke"}`}
                  btnSpanClass={selectedFilter.value === 1 ? "gradient_text" : ""}
                  onClick={() => setFilterSelected(filters[1])}
                  children={'Credit'}
                />
              </div>
              <div className="mr-2">
                <Button
                  type="button"
                  fclassname={`font-weight-500 px-4 py-2 rounded-pill background_none ${selectedFilter.value === 2 ? "border1pxSolid" : "borderStroke"}`}
                  btnSpanClass={selectedFilter.value === 2 ? "gradient_text" : ""}
                  onClick={() => setFilterSelected(filters[2])}
                  children={'Debit'}
                />
              </div>
            </div>}
          </div>
        </div>

        <div
          className={
            mobileView ? "overflow-auto pb-5" : "dv__transList overflow-auto"
          }
          id="walletTra"
          style={
            mobileView
              ? { height: "100%" }
              : { height: "90%", scrollbarColor: "#c4c4c4 #f5f5f5" }
          }
          ref={divRef}
        >
          {!transactions ? (
            <div className="h-100 d-flex align-items-center justify-content-center">
              <CustomDataLoader type="ClipLoader" loading={true} size={60} />
            </div>
          ) : transactions.length > 0 ? (
            <div className="col-12 marginBottom">
              {transactions.map((itms, index) => {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      handleTransactionDetails(itms)
                    }
                  >
                    <TranjectionItems
                      // withdrawal={true}
                      key={index}
                      {...itms}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <Icon
                  icon={`${env.NO_TRANSACTIONS_IMG}#no_transactions_found`}
                  color={theme?.appColor}
                  size={94}
                  viewBox="0 0 94 92.225"
                />

                <p className={mobileView ? "m-0 mt-3" : `${theme?.type == "light" ? "dv__black_color" : "dv__white_color"}`}>
                  {lang.noTransactionYet}
                </p>
              </div>
            </div>
          )}
          <PaginationIndicator
            id={"walletTra"}
            totalData={transactions}
            pageEventHandler={() => {
              if (!loader && hasMore) {
                getUserTransactions(null, true)
              }
            }}
          />
        </div>
      </div>

      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          .walletBalanceCard {
            background: ${theme.palette.l_base};
            padding: 20px 0;
            border-radius: 13px;
          }
          .filterSec {
            width: 18.594vw;
            margin: 0 0 0 auto;
          }
        `}
      </style>
    </Wrapper>
  );
}
