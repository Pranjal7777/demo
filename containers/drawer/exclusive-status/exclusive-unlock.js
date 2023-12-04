import React from "react";

const ExclusiveUnlock = (props) => {
    const {close, onClose} = props
    return (
        <div className="col-12 pt-3 pb-4">
            <div className="hr__cus"></div>
            <p className="txt__desc__status mb-3">Please confirm you want to unlock Xclusive for $100.</p>
            <div className="form-row txt__desc__status">
                <div className="col">
                    <button onClick={close || onClose} className="btn btn__confirm">Confirm</button>
                </div>
                <div className="col">
                    <button onClick={close || onClose} className="btn btn__confirm__outline">Cancel</button>
                </div>
            </div>
            <style jsx>
                {`
                    .btn__confirm, .btn__confirm:hover{
                        background-color: var(--l_base);
                        color: #ffffff;
                        font-size: 14px;
                        font-family: 'Avenir-Bold',sans-serif !important;
                        border-color: var(--l_base);
                        width: 100%;
                        border-radius: 20px;
                    }

                    .btn__confirm__outline, .btn__confirm__outline:hover{
                        background-color: #ffffff;
                        color: var(--l_base);
                        font-size: 14px;
                        font-family: 'Roboto',sans-serif !important;
                        border-color: var(--l_base); 
                        width: 100%;
                        border-radius: 20px;
                    }

                    .txt__desc__status{
                        text-align: center;
                        width: 100%;
                        max-width: 260px;
                        margin: auto;
                    }

                    .hr__cus{
                        background: rgb(0 0 0 / 60%);
                        height: 2px;
                        width: 50px;
                        margin: auto;
                        margin-bottom: 25px;
                    }
                    
                `}
            </style>
        </div>
    )
};
export default ExclusiveUnlock;
