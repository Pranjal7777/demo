import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import {
  open_dialog,
  open_drawer,
  stopLoader,
} from "../../lib/global";
import { getWithdrowLogs } from "../../services/payments";
import { getCookiees } from "../../lib/session";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import CustomDataLoader from "../loader/custom-data-loading";

const Header = dynamic(() => import("../header/header"), { ssr: false });
const Pagination = dynamic(() => import("../../hoc/divPagination"), { ssr: false });
const TranjectionItems = dynamic(() => import("../transaction/transactionItems"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const Icon = dynamic(() => import("../image/icon"), { ssr: false });


const WithDrawalLogs = (props) => {
  const theme = useTheme();
  const lang = useLang();
  const [mobileView] = isMobile();

  const [totalCount, settotalCount] = useState(10);
  const [pageState, setPageState] = useState("");
  const [transactions, setTransaction] = useState(null);

  useEffect(() => {
    getWithdrawTrans();
  }, []);

  const getWithdrawTrans = async (page, loader = false) => {
    return new Promise(async (res, rej) => {

      const newpageState = !loader ? "" : pageState;
      try {
        const userId = getCookiees("uid");
        let data = await getWithdrowLogs(userId, newpageState, 10);
        let newTransaction = data.data.data.data;
        let oldTransaction = transactions && page != 0 ? transactions : [];
        settotalCount(data.data.data.totalCount);
        setTransaction([...oldTransaction, ...newTransaction]);
        setPageState(data.data.data.pageState);
        stopLoader();
        res();
      } catch (e) {
        console.error("ERROR IN getWithdrawTrans", e);
        stopLoader();
        rej();
      }
    });
  };

  return (
    <div className={mobileView ? "bg-dark-custom vh-100" : "h-100"}>
      {mobileView && <Header
        title={"Withdrawal Logs"}
        icon={env.backArrow}
        back={() => props.onClose()}
      />
      }
      <div
        className={mobileView
          ? "bg-dark-custom overflow-auto pb-5 h-100"
          : "overflow-auto dv__transList"
        }
        id="withdrawalLog"
        style={mobileView ? {} : { height: "95%" }
        }
      >
        <Pagination
          id={"withdrawalLog"}
          items={transactions}
          totalRecord={totalCount}
          getItems={getWithdrawTrans}
        >
          {!transactions
            ? <div className="h-100 d-flex align-items-center justify-content-center">
              <CustomDataLoader type="ClipLoader" loading={true} size={60} />
            </div>
            : transactions.length > 0
              ? <div
                className="col-12"
                style={mobileView ? { paddingTop: "50px" } : {}}
              >
                {transactions.map((itms, index) => {
                  return (
                    <div
                      key={index}
                      className="transBgBtn-t"
                      onClick={() => {
                        mobileView
                          ? open_drawer("withdrawalInfo", {
                            ...itms,
                          },
                            "right"
                          )
                          : open_dialog("withdrawalInfo", {
                            ...itms,
                          });
                      }}
                    >
                      <TranjectionItems
                        withdrawal
                        key={index}
                        {...itms}
                      />
                    </div>

                  );
                })}
              </div>
              : <div className="h-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <Icon
                    icon={`${env.NO_TRANSACTIONS_IMG}#no_transactions_found`}
                    color={theme?.appColor}
                    size={94}
                    viewBox="0 0 94 92.225"
                  />
                  <p className={`m-0 mt-3 ${theme.type == "light" ? "text-black" : "text-white"}`}>
                    No Transactions Yet
                  </p>
                </div>
              </div>
          }
        </Pagination>
      </div>
    </div>
  );
};

export default WithDrawalLogs;
