import React from "react";
import isMobile from "../../hooks/isMobile";
import Icon from "../../components/image/icon";
import { P_CLOSE_ICONS } from "../../lib/config";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import { useUserWalletBalance } from "../../hooks/useWalletData";
import { open_dialog, open_drawer } from "../../lib/global/loader";

export default function PurchaseConfirmWallet(props) {
    const theme = useTheme();
    const [mobileView] = isMobile();
    const [userWalletBalance] = useUserWalletBalance()
    const handlePurchaseSuccess = () => {
        mobileView ? open_drawer("coinsAddedSuccess", {}, "bottom") : open_dialog("coinsAddedSuccess", {})
    }

    const handleConfirmation = () => {
        mobileView
            ?
            (userWalletBalance < props.price) ?
                open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") : props.checkout()
            :
            (userWalletBalance < props.price) ?
                open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }) : props.checkout()
    }
    return (
        <Wrapper>
            <>
                <div className='specific_section_bg text-app'>
                    <div className=" pt-2">
                        <div>
                            <h4 className="text-app">{props.titleName}</h4>
                            <div className='hover_bgClr position-absolute' onClick={props.onClose} style={{ borderRadius: "10px", padding: '6px', top: mobileView ? '10px' : "12px", right: mobileView ? "18px" : "8px" }}>
                                <Icon
                                    icon={`${P_CLOSE_ICONS}#cross_btn`}
                                    hoverColor='var(--l_base)'
                                    color={'var(--l_app_text)'}
                                    width={20}
                                    height={20}
                                    alt="Back Arrow"
                                />
                            </div>
                        </div>
                        <div className='text-center mt-4'>
                            <h4 className='mb-0 '>
                                {props.title}
                            </h4>
                        </div>
                        <div className="">
                            <p className="text-wrap w-100 text-center mx-auto textFaintGray mt-3 mb-1 d-flex justify-content-center">
                                {props.description}
                            </p>
                            <p className="text-wrap w-50 text-center mx-auto textFaintGray bold d-flex justify-content-center">
                                {props.descriptionTwo}
                            </p>
                        </div>
                    </div>
                    <div className='px-5 py-1 specific_section_bg mb-2'>
                        <Button
                            type="button"
                            fclassname='rounded-pill my-2 gradient_bg'
                            btnSpanClass=" font-weight-500 letterSpacing3 text-white fntsz1rem"
                            onClick={handleConfirmation}
                            children={props.button}
                        />
                    </div>
                </div>
            </><style jsx>{`
            :global(.purchaseConfirmWallet){
                width:${mobileView && "90vw"}
            }
            `}
            </style>
        </Wrapper >
    );
}
