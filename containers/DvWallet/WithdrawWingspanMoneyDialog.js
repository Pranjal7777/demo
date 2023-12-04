import React from 'react'
import useLang from "../../hooks/language";
import Button from '../../components/button/button';
import Icon from '../../components/image/icon';
import { CLOSE_ICON_WHITE } from '../../lib/config/logo';
import { Toast, open_dialog, open_drawer } from '../../lib/global/loader';
import { withDrawMoney } from '../../services/payments';
import isMobile from '../../hooks/isMobile';
import { withdrawTransaction } from '../../lib/rxSubject';
import useProfileData from '../../hooks/useProfileData';

const WithdrawWingspanMoneyDialog = (props) => {
    const { withdrawWalletDetails, walletDetails } = props;
    const [mobileView] = isMobile();
    const [profileData] = useProfileData();
    const [lang] = useLang();

    const handleWithdrawMoney = async () => {
        let { username, email } = profileData;
        let requestPayload = {
            walletId: walletDetails?.walletData?.[0]?.walletid,
            amount: Number(withdrawWalletDetails?.withdrawAmount),
            countryCode: "IN",
            withdrawAmount: Number(withdrawWalletDetails?.netPay),
            withdrawCurrency: withdrawWalletDetails?.withdrawCurrency,
            pgName: "WINGSPAN",
            autoPayout: true,
            userName: username,
            email: email,
            // notes: ""
        };
        try {
            const res = await withDrawMoney(requestPayload);
            if (res?.status === 200) {
                mobileView ? open_drawer("WithdrawSuccessInfo",
                    {
                        successMessage: "Withdrawal Request Submitted Successfully",
                        successMessage2: "Your withdraw request has been submitted and will be processed shortly.",
                    },
                    "bottom"
                )
                    : open_dialog("WithdrawSuccessInfo",
                        {
                            successMessage: "Withdrawal Request Submitted Successfully",
                            successMessage2: "Your withdraw request has been submitted and will be processed shortly.",
                        }
                    )
            }
            withdrawTransaction.next({ isApicall: true });
        } catch (error) {
            console.log(error);
            Toast(error?.message, "error")
        }
    }

    return (
        <div className='px-4 py-3' style={!mobileView ? { width: "500px" } : {}}>
            <div>
                <div className='d-flex flex-row justify-content-end align-items center'>
                    <Icon
                        icon={`${CLOSE_ICON_WHITE}#close-white`}
                        color={"var(--l_app_text)"}
                        size={16}
                        onClick={() => props.onClose()}
                        alt="back_arrow"
                        class="cursorPtr"
                        viewBox="0 0 16 16"
                    />
                </div>
                <h5 className='text-center mb-4'>Withdraw with Wingspan</h5>
                <div className='gradient_bg radius_12 p-3 d-flex flex-column mb-3'>
                    <div className='d-flex flex-row justify-content-between align-items-center'>
                        <div>Available Balance</div>
                        <div
                            className='border rounded-pill d-flex justify-content-center align-items-center cursorPtr'
                            onClick={() => open_dialog("WithdrawChargeDetails", { walletInfo: "withdrawChargedAmountDetails", withdrawWalletDetails })}
                            style={{ lineHeight: "0px", width: "18px", height: "18px" }}
                        >
                            i
                        </div>
                    </div>
                    <h5 className='w-700 mb-0 mt-2'>${withdrawWalletDetails?.netPay || 0}</h5>
                </div>
                <div>
                    <strong>Note:</strong>
                    <p className='light_app_text pt-1'>Funds will be transferred to your preferred
                        payment method setup on Wingspan. Your Wingspan
                        credentials have been sent to your registered
                        email address.
                    </p>
                </div>
            </div>
            <div className='mt-5'>
                <Button
                    type="button"
                    fclassname="btnGradient_bg rounded-pill"
                    onClick={handleWithdrawMoney}
                    children={lang.withdraw}
                />
            </div>
        </div>
    )
}

export default WithdrawWingspanMoneyDialog