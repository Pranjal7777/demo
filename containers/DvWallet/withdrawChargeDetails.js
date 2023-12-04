import React from 'react'
import Icon from '../../components/image/icon'
import { CLOSE_ICON_WHITE } from '../../lib/config/logo'
import isMobile from '../../hooks/isMobile'

const WithdrawChargeDetails = (props) => {
    const [mobileView] = isMobile();
    const { withdrawWalletDetails, walletInfo = "" } = props;

    const walletInfoTextComponent = {
        "withdrawChargedAmountDetails": <>
            <h5 className='text-center mb-4'>Withdraw Breakdown</h5>
            <div className='d-flex flex-column'>
                <div className='d-flex flex-row justify-content-between align-items-center my-1'>
                    <div className='light_app_text'>Available Balance:</div>
                    <strong>${withdrawWalletDetails?.withdrawAmount || 0}</strong>
                </div>
                <div className='d-flex flex-row justify-content-between align-items-center my-1'>
                    <div className='light_app_text'>Credit Card Fees:</div>
                    <strong>-${withdrawWalletDetails?.appCommission || 0}</strong>
                </div>
                <div className='d-flex flex-row justify-content-between align-items-center my-1'>
                    <div className='light_app_text'>Transfer Fees:</div>
                    <strong>-${withdrawWalletDetails?.withdrawFixFee || 0}</strong>
                </div>
                <div className='borderTop my-1'></div>
                <div className='d-flex flex-row justify-content-between align-items-center my-1'>
                    <div className='light_app_text'>Available to Withdraw</div>
                    <strong>${withdrawWalletDetails?.netPay || 0}</strong>
                </div>
            </div>
        </>,
        "activePendingInfo": <div className='d-flex flex-column'>
            <h6>Available Balance: </h6>
            <div className='light_app_text'>Available balance refers to the amount in your wallet that can be withdrawn. This includes funds deposited prior to 14 days.</div>
            <br />
            <h6>Pending Balance: </h6>
            <div className='light_app_text'>Pending balance refers to the amount in your wallet that cannot be withdrawn for a period of 14 days.</div>
        </div>
    }

    const getWalletDetailsInfo = () => {
        return walletInfoTextComponent[walletInfo]
    }

    return (
        <div className='px-4 py-3' style={{ width: mobileView ? "300px" : "450px" }}>
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
            {getWalletDetailsInfo()}
        </div>
    )
}

export default WithdrawChargeDetails