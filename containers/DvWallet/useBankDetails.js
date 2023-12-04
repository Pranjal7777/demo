import React, { useEffect, useState } from 'react'
import { getCountry } from '../../services/address';
import { AdditionalBankDetails, addBankDetails, changeBankDetails, deleteBankDetails, getBankDetails } from '../../services/addBank';
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader } from '../../lib/global/loader';
import isMobile from '../../hooks/isMobile';
import usePg from "../../hooks/usePag";
import { getWallet } from '../../redux/actions';
import { withDrawMoney } from '../../services/payments';
import useWalletData from '../../hooks/useWalletData';
import { useDispatch } from 'react-redux';
import { useTheme } from 'react-jss';
import moment from 'moment/moment';


const useBankDetails = () => {
    const [mobileView] = isMobile();
    const theme = useTheme();
    const [pg] = usePg();
    const [wallet] = useWalletData();
    const dispatch = useDispatch();
    const [currencySymbol, setCurrencySymbol] = useState("USD");
    const [changeStep, setChangeStep] = useState("AddBank")
    const [countryList, setCountryList] = useState([{ countryCode: "Us", countryName: "United States of America" }]);
    const [editBankDetails, setEditBankDetails] = useState();
    const [userDetails, setUserDetails] = useState([]);
    const [additionalBankDetails, setAdditionalBankDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const pgId = typeof pg[0] != "undefined" ? pg[0].pgId : "";
    const pgName = typeof pg[0] != "undefined" ? pg[0].pgName : "";
    const walletId = wallet?.walletData[0]?.walletid;


    const fetchApiDetails = async() => {
        try {
            setIsLoading(true)
            const res = await getBankDetails();
            if(res.status == 200) {
                setUserDetails(res?.data?.data)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }


    const handleBankDetailsSumbit = async(values,editBankDetails) => {
        let payload = {
            countryCode: values.countryCode,
            accountHolderName: values?.accountHolderName,
            accountNumber: String(values?.accountNumber),
            bankName: values?.bankName
        }
        if (additionalBankDetails?.length){
            payload.additionalFields = []
            additionalBankDetails?.filter((field) => field.fieldName && values[field?.fieldName] ).forEach((single)=>{
                payload.additionalFields.push({
                    fieldName: String(single.fieldName),
                    value:  String(values[single.fieldName])
                })
        })}

        try {
            startLoader();
            let res;
            if (userDetails?.length && (userDetails?.[0]?.status === "NOT_VERIFIED" || userDetails?.[1]?.status === "NOT_VERIFIED")) {
                payload.bankId = editBankDetails?.bankId;
                res = await changeBankDetails(payload);
            }else if((!userDetails?.length || userDetails?.[0]?.status === "VERIFIED")){
                res = await addBankDetails(payload);
            }
            
            if (res?.status == 200) {
                console.log(res);
                setEditBankDetails(null);
                Toast("Your account added successfully", "success")
            }
            stopLoader();
            close_dialog('withdrawMoney');
            close_drawer('withdrawMoney');
        } catch (error) {
            stopLoader();
            Toast(error?.message, "error")
            console.log(error);
            setEditBankDetails(null);
            close_dialog('withdrawMoney');
            close_drawer('withdrawMoney');
        }
    }

    const userWithDrowMoney = async (withdrawAmount) => {
        // let { id } = account;
        try {
          let requestPayload = {
            pgId: pgId,
            bankId: userDetails[0]?.bankId,
            amount: String(withdrawAmount),
            withdrawCurrency: currencySymbol,
            pgName: pgName,
            autoPayout: true,
            walletId: walletId,
            withdrawAmount: withdrawAmount,
            countryCode: userDetails[0]?.countryCode,
          };
    
          startLoader();
          let data = await withDrawMoney(requestPayload);
    
          dispatch(getWallet());
          {mobileView ? open_drawer("paymentSuccess", {
            id: data?.data?.data?.txnId,
            type: 7,
            text: "Withdrawal request submitted successfully",
            rechargeMode: data?.data?.data?.notes,
            amount:  withdrawAmount,
            currency: currencySymbol,
            time: moment(data?.data?.data?.createdAt).format("DD MMM YY ,h:mm a"),
            mobileView,
            theme,
          }, "bottom") : open_dialog("paymentSuccess", {
            id: data?.data?.data?.txnId,
            type: 7,
            text: "Withdrawal request submitted successfully",
            rechargeMode: data?.data?.data?.notes,
            amount:  withdrawAmount,
            currency: currencySymbol,
            time: moment(data?.data?.data?.createdAt).format("DD MMM YY ,h:mm a"),
            theme,
          });}
          stopLoader();
        } catch (e) {
          stopLoader();
          Toast(e.response?.data?.message, "error");
        }
      };

      const deleteBankDetail = async(details) => {
        let payload = {
            bankId: details,
        }
        try {
            startLoader()
            const res = await deleteBankDetails(payload);
            Toast("account deleted successfully", "success")
            stopLoader()
            close_dialog('withdrawMoney');
            close_drawer('withdrawMoney');
        } catch (error) {
            stopLoader()
            console.log(error);
            Toast("something went wrong", "error");
            close_dialog('withdrawMoney');
            close_drawer('withdrawMoney');
        }
    }


    const confirmWithdrawlMoney = (details, action="") => {
        let accountEndNumber = userDetails[0]?.accountNumber?.substr(userDetails[0]?.accountNumber?.length - 4)
        mobileView
            ? open_drawer("confirmDrawer",
                {
                    title: action === "delete" ? "Delete Account" : "Withdraw Money",
                    subtitle: `Are you sure you want to ${action === "delete" ? "delete your" : `Withdraw $${details} to`} Bank of America with A/c No. **** **** **** ${accountEndNumber}?`,
                    cancelT: "Cancel",
                    submitT: "Confirm",
                    yes: () => {
                        action === "delete" ? deleteBankDetail(details) : userWithDrowMoney(details);
                        close_drawer("confirmDrawer");
                      },
                    no: () => action === "delete" ? {} : setCurrentStep("Withdraw"),
                },
                "bottom"
            )
            : open_dialog("confirmDialog", {
                title: action === "delete" ? "Delete Account" : "Withdraw Money",
                subtitle: `Are you sure you want to ${action === "delete" ? "delete your" : `Withdraw $${details} to`} Bank of America with A/c No. **** **** **** ${accountEndNumber}?`,
                cancelT: "Cancel",
                submitT: "Confirm",
                yes: () => {
                    action === "delete" ? deleteBankDetail(details) : userWithDrowMoney(details);
                    close_dialog("confirmDialog");
                  },
                no: () => action === "delete" ? {} : setCurrentStep("Withdraw"),
            });
    };


    const setCurrentStep = (step) => {
        setChangeStep(step);
    }

    const getCountryList = async () => {
        const countrydata = await getCountry();
        setCountryList(countrydata.data.data);
    }

    const getAdditionalBankDetails = async(data) => {
        try {
            const res = await AdditionalBankDetails(data);
            setAdditionalBankDetails(res?.data?.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditClick = (id) => {
        const bankDetails = userDetails.find((data) => String(data.bankId) === String(id))
        if (bankDetails) {
            setEditBankDetails(bankDetails)
        }
    }

    useEffect(() => {
        if (editBankDetails) {
            setCurrentStep('changeBank')
        }
    }, [editBankDetails])

    useEffect(() => {
        if (userDetails.length) {
            setCurrentStep('ContinueBank')
        }
    }, [userDetails])

    return (
        [userDetails, editBankDetails, countryList, changeStep,additionalBankDetails,isLoading,confirmWithdrawlMoney, handleEditClick, getCountryList, setCurrentStep, fetchApiDetails,handleBankDetailsSumbit,getAdditionalBankDetails]
    )
}

export default useBankDetails