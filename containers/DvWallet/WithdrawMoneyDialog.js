import React, { useState } from 'react'
import DVinputText from '../../components/DVformControl/DVinputText'
import { useEffect } from 'react'
import Button from '../../components/button/button'
import isMobile from '../../hooks/isMobile'
import { CROSS } from '../../lib/config/profile'
import Icon from '../../components/image/icon'
import { close_dialog, close_drawer } from '../../lib/global/loader'
import { getIn, useFormik } from 'formik'
import * as Yup from "yup";
import useLang from '../../hooks/language'
import useBankDetails from './useBankDetails'
import CustomDataLoader from '../../components/loader/custom-data-loading'
import { DELETE_SVG } from '../../lib/config/logo'
import useWalletData from '../../hooks/useWalletData'



const WithdrawMoneyDialog = () => {
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const [wallet] = useWalletData();
    const [userDetails, editBankDetails, countryList, changeStep, additionalBankDetails,isLoading,confirmWithdrawlMoney, handleEditClick, getCountryList, setCurrentStep, fetchApiDetails, handleBankDetailsSumbit, getAdditionalBankDetails] = useBankDetails(); // custom hook;
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [maxAmount, setMaxAmount] = useState(wallet?.walletData[0]?.balance);
    const [minAmount, setMinAmount] = useState(wallet?.walletData[0]?.withdrawal_limit);

    useEffect(() => {
        if (changeStep == "ConfirmWithdraw") {
            confirmWithdrawlMoney(withdrawAmount, "withdraw") // for call dialog function
        }
    }, [changeStep])

    const BankValidationSchema = () => Yup.object().shape({
        accountHolderName: Yup.string().required(`AccountHolderName ${lang.required}`),
        countryCode: Yup.string().required(`country ${lang.required}`),
        accountNumber: Yup.number().required(`AccountNumber ${lang.required}`),
        bankName: Yup.string().required(`BankName ${lang.required}`),
    })

    
    let formik = useFormik({
        initialValues: {
            countryCode: editBankDetails?.countryCode || 'us',
            accountHolderName: editBankDetails?.accountHolderName || '',
            accountNumber: editBankDetails?.accountNumber || '',
            bankName: editBankDetails?.bankName || '',
        },
        onSubmit: (values, { setSubmitting }) => handleBankDetailsSumbit(values, editBankDetails),
        validationSchema: BankValidationSchema,
    });
    useEffect(()=>{
       if(editBankDetails) {
        const initialValue = {
            countryCode: editBankDetails.countryCode || 'us',
            accountHolderName: editBankDetails.accountHolderName || '',
            accountNumber: editBankDetails.accountNumber || '',
            bankName: editBankDetails.bankName || '',
            ...editBankDetails?.additionalFields.reduce((acc, cur) => ({...acc, [cur.fieldName]: cur.value}), {})
          };
          formik.setValues(initialValue);
       }
    },[editBankDetails])
    
    const watchCountryCode = getIn(formik?.values, "countryCode");

    useEffect(() => {
        formik.validateForm();
        getCountryList();
        fetchApiDetails();
    }, []);

    useEffect(() => {
        getAdditionalBankDetails(watchCountryCode);
    }, [watchCountryCode])

    const changeHandler = (data) => {
        if (data?.status == "VERIFIED" && userDetails?.length == 1) {
            handleEditClick(data?.bankId); // for change bank details
        } else if (data?.status == "NOT_VERIFIED") {
            handleEditClick(data?.bankId) // for edit bank details
        }
    }

    const SwitchHandler = () => {
        switch (changeStep) {
            case "AddBank":
            case "changeBank":
                return (
                    <div className='bank_input_section scroll-hide'>
                        {addBankForm()}
                    </div>
                )
                break;
            case "ContinueBank":
                return (
                    <div className='bank_details_field scroll-hide'>
                        {userDetails?.map((data, index) => {
                            return AddedBankDetails(data, index)
                        })}
                    </div>
                )
            case "Withdraw":
            case "ConfirmWithdraw":
                return (
                    <>
                        <div style={{ minHeight: `${mobileView ? "" : "calc(var(--vhCustom, 1vh) * 62.5)"}` }}>
                            <div className={`text-center ${mobileView ? "dv__fnt28" : "dv__fnt17"} mb-3`}>You can withdraw a maximum of ${maxAmount}</div>
                            <div>
                                <DVinputText
                                    labelTitle="Amount"
                                    className="dark_input_section"
                                    id="AccountHolderName"
                                    min="1"
                                    // max="124"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    name="AccountHolderName"
                                    autoComplete='off'
                                    placeholder={`Enter Amount`}
                                    type="number"
                                    autoFocus
                                    onChange={(e)=>setWithdrawAmount(+(e?.target?.value))}
                                />
                            </div>
                            {withdrawAmount == 0 ? "" : (minAmount > withdrawAmount || withdrawAmount > maxAmount) ? <div className='text-danger'>{lang?.maxWithdrawMoney} ${minAmount} or {lang?.maxWithdrawText} ${maxAmount}</div> : ""}
                        </div>
                        <style>{`
                            .dark_input_section:focus{
                                background-color: #121212 !important;
                                border-color: ${withdrawAmount == 0 ? "" : (minAmount > withdrawAmount || withdrawAmount > maxAmount) ? "#F42121" : "#00B73E"} !important;
                            }
                        `}</style>
                    </>
                );
                break;
            default:
                break;
        }
    }

    const handleBtn = () => {
        let boolArray = [];
        let manadatory = additionalBankDetails?.filter((data) => data.mandatory);
        // dynamic field validation
        manadatory?.map((attr, index) => {
            if (
                formik?.values[attr?.fieldName]
                ) {
                    boolArray.push(true);
                } else {
                    boolArray.push(false);
                }
            });
            return boolArray.findIndex((data) => data === false) > -1 ? false : true;
        };

    const addBankForm = () => {
        return (
            <>
                <form id="addbankDetails" onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className="">
                        <label>Country *</label>
                        <select className="form-control ipt__brod pr-4 dark_selectInput_section selectpicker" data-live-search="true"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type='text'
                            inputType='text'
                            name='countryCode'
                            error={formik.errors.countryCode && formik.touched.countryCode}
                            placeholder='Enter country'>
                            <option value={"us"} data-tokens="us" hidden>United State of America</option>
                            {countryList && countryList?.map((data) =>
                                <option data-tokens={data?.countryCode} value={data?.countryCode}>{data?.countryName}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <DVinputText
                            labelTitle={lang?.AccountHolderName}
                            className="dark_input_section"
                            id="accountHolderName"
                            name="accountHolderName"
                            value={formik.values.accountHolderName}
                            error={formik.touched.accountHolderName && formik.errors.accountHolderName}
                            autoComplete='off'
                            placeholder={lang.AccountHolderName}
                            type="accountHolderName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            autoFocus
                        />
                    </div>
                    <div>
                        <DVinputText
                            labelTitle={lang?.AccountNumber}
                            className="dark_input_section"
                            id="accountNumber"
                            name="accountNumber"
                            value={formik.values.accountNumber}
                            error={formik.touched.accountNumber && formik.errors.accountNumber}
                            autoComplete='off'
                            placeholder={lang.AccountNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="number"
                        />
                    </div>
                    <div>
                        <DVinputText
                            labelTitle={lang?.BankName}
                            className="dark_input_section"
                            id="bankName"
                            name="bankName"
                            value={formik.values.bankName}
                            error={formik.touched.bankName && formik.errors.bankName}
                            autoComplete='off'
                            placeholder={lang?.BankName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="text"
                        />
                    </div>
                    <div>
                        {additionalBankDetails && additionalBankDetails?.map((field, index)=>{
                            switch (field?.type) {
                                case "STRING":
                                    return (
                                        <DVinputText
                                        labelTitle={field?.fieldName}
                                        className="dark_input_section"
                                        id={field?.fieldName}
                                        name={field?.fieldName}
                                        value={formik.values?.[field?.fieldName]}
                                        error={formik.touched?.[field?.fieldName] && formik.errors?.[field?.fieldName]}
                                        autoComplete='off'
                                        placeholder={field?.fieldName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type={field?.type}
                                    />
                                    )
                                    break;
                            
                                default:
                                    break;
                            }
                        })}
                    </div>
                </form>
                <style>{`
                .dark_selectInput_section{
                    background: #1E1C22 !important;
                    border-color: var(--l_input_bg) !important;
                    color: var(--l_app_text) !important;
                    border-radius: 8px;
                    font-size: 1rem;
                    height: 3rem;
                    margin-bottom: 15px;
                }
                .dark_input_section:focus{
                    background-color: #121212 !important;
                    padding: 15px;
                }
                :global(.dark_input_section .error-tooltip-container) {
                    right: 0px !important;
                    top: 50%;
                }
            `}</style>
            </>
        )
    }

    const AddedBankDetails = (data, index) => {
        const countryData = countryList?.find((list) => list?.countryCode == data?.countryCode)
        return (
            <>
                <div key={index} className='mb-3 mx-auto' style={{ background: '#2D2639', borderRadius: '16px', maxWidth: "35.59vw", minWidth: `${mobileView ? "22.4rem" : '25.99rem'}` }}>
                    <header className='row mx-0 px-3 pt-3 pb-1'>
                        <div className='col-9 pl-0'>
                            <h6 className='mb-0'>{data?.bankName}</h6>
                            <div className={data?.status === "VERIFIED" ? "text-success" : "text-danger"}>{data?.status === "VERIFIED" ? "Approved" : "Pending"}</div>
                        </div>
                        <div className='col-3 pr-0 d-flex align-items-center justify-content-end'>
                            <div onClick={() => changeHandler(data)} className={`viewText mx-3 cursorPtr ${data?.status === "VERIFIED" && userDetails?.length > 1 && "text-muted"}`}>{data?.status === "VERIFIED" ? "Change" : "Edit"}</div>
                            {data?.status === "VERIFIED" && <div onClick={()=> confirmWithdrawlMoney(data?.bankId, "delete")} >
                                <Icon
                                    icon={`${DELETE_SVG}#delete_icon_b`}
                                    width="18"
                                    height="20"
                                    viewBox="0 0 17 18"
                                    class="d-flex justify-content-end cursorPtr"
                                />
                            </div>}
                        </div>
                    </header>
                    <hr className="m-0" style={{ borderTop: '1px solid #3D3B45' }} />
                    <div className='p-3 row mx-0'>
                        <div className='col-5 px-0 pb-2 delightTxt'>Name :</div>
                        <div className='col-7 px-0 pb-2'>{data?.accountHolderName}</div>
                        <div className='col-5 px-0 py-2 delightTxt'>{lang.AccountNumber} :</div>
                        <div className='col-7 px-0 py-2'>{data?.accountNumber}</div>
                        <div className='col-5 px-0 py-2 delightTxt'>Country :</div>
                        <div className='col-7 px-0 py-2'>{countryData && countryData?.countryName}</div>
                        {data?.additionalFields?.map((dataField, index2)=>
                        (
                         <>
                         <div key={index2} className='col-5 px-0 py-2 delightTxt'>{dataField?.fieldName} :</div>
                        <div className='col-7 px-0 py-2'>{dataField?.value}</div>
                        </>))}
                    </div>
                </div>
            </>
        )
    }

    const submitClickHandler = () => {
        switch (changeStep) {
            case "AddBank":
            case "changeBank":
                return setCurrentStep("ContinueBank")
                break;
            case "ContinueBank":
                return setCurrentStep("Withdraw")
                break;
            case "Withdraw":
                return setCurrentStep("ConfirmWithdraw")
                break;
            default:
                break;
        }
    }



    return (
        <>
            <div style={{ background: "#1E1C22", minWidth: `${mobileView ? "" : '30.5rem'}`,  minHeight: `calc(var(--vhCustom, 1vh) * ${mobileView ? (changeStep === "ContinueBank" && userDetails?.length === 2) ? "75" : "48" : "85"})`, position: 'relative' }}>
                <header className='px-3 py-3 py-sm-2 position-relative'>
                    <div className={`text-center my-1 ${mobileView ? "dv__fnt28" : "dv__fnt20"}`}>
                        Add Bank Account Details
                    </div>
                        <div
                            className="text-muted cursorPtr position-absolute"
                            style={{ right: '2%', top: '20%' }}
                            onClick={() => mobileView ? close_drawer("withdrawMoney") : close_dialog("withdrawMoney")}
                        >
                            <Icon
                                icon={`${CROSS}#cross`}
                                size={30}
                                unit={"px"}
                                color={"#1E1C22"}
                                viewBox="0 0 20 20"
                            />
                        </div>
                </header>
                <hr className="m-0" style={{ borderTop: '1px solid #3D3B45' }} />
                {!isLoading ?<div className='p-2 p-sm-3 pb-2 h-100'>

                    {SwitchHandler()}

                    {(userDetails && userDetails[0]?.status !== "NOT_VERIFIED" || ["changeBank", "AddBank"].includes(changeStep)) && <div className='px-2 bottom_btn'>
                        <Button
                            type="submit"
                            cssStyles={{
                                background: "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                                width: '92%',
                            }}
                            form="addbankDetails"
                            fclassname='mt-2 mx-auto'
                            disabled={["changeBank", "AddBank"].includes(changeStep) ? !(handleBtn() && formik.isValid) : (["Withdraw"].includes(changeStep) && (minAmount > withdrawAmount || withdrawAmount > maxAmount)) ? true : false }
                            onClick={userDetails?.length && !["AddBank", "changeBank"].includes(changeStep) ? submitClickHandler : () => {}}
                            children={["AddBank", "changeBank"].includes(changeStep) ? "Submit" : changeStep == "ContinueBank" ? "Continue" : "Withdraw"}
                        />
                    </div>}
                </div> : 
                <div className="d-flex align-items-center justify-content-center position-static profileSectionLoader" style={{height: '50vh'}}>
                <CustomDataLoader loading={isLoading} type="ClipLoader" size={60} />
              </div>
              }
            </div>
            <style jsx>{`
        :global(.withdrawMoney) {
            border-radius: 20px;
            overflow: hidden;
        }
        :global(.bank_input_section){
            min-height: ${"calc(var(--vhCustom, 1vh) * 62.5)"};
            overflow-y: auto;
            max-height: ${mobileView ? "calc(calc(var(--vhCustom, 1vh) * 72.5) - 120px)" : "calc(calc(var(--vhCustom, 1vh) * 80) - 105px)"};
        }
        :global(.bank_details_field){
            min-height: ${mobileView ? "" :"calc(var(--vhCustom, 1vh) * 62.5)"};
            overflow-y: auto;
            max-height: ${mobileView ? "calc(calc(var(--vhCustom, 1vh) * 72.5) - 120px)" : "calc(calc(var(--vhCustom, 1vh) * 80) - 105px)"};
        }
        :global(.dark_input_section){
            background: none !important;
            border-color: var(--l_input_bg) !important;
            color: var(--l_app_text) !important;
            border-radius: 8px;
            font-size: 1rem;
            padding: 15px;
            height: 3rem;
            width:100%;
        }
        .bottom_btn{
            position: absolute;
            bottom: 15px;
            left: 20px;
            right: 20px;
        }
    `}</style>
        </>
    )
}

export default WithdrawMoneyDialog