import React from "react";
import * as config from "../../../lib/config";
import Router from 'next/router';

const SelectTag = props => {
    const { close, onClose } = props;
    return (
        <div className="pg__scrl">

            <div className="col-12 py-3">
                <img onClick={close || onClose} src={config.backArrow} width="26" className="backArr__img" alt="back-arrow" />
                <h5 className="text-center pg__title">Select Tag</h5>
            </div>

            <div className="col-12 mb-4">
                <form>
                    <div className="form-group">
                        <input type="text" className="form-control ipt__brod ipt__selTag" placeholder="Search" />
                    </div>
                </form>
            </div>

            <div className="col-12">
                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#dance</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#music</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/2078265/pexels-photo-2078265.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#sports</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>
                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#dance</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#music</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/2078265/pexels-photo-2078265.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#sports</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>
                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#dance</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#music</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/2078265/pexels-photo-2078265.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#sports</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>
                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#dance</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#music</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>

                <div className="form-row align-items-center justify-content-center border-bottom pb-3 mb-3">
                    <div className="col-auto">
                        <img src="https://images.pexels.com/photos/2078265/pexels-photo-2078265.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="prof__img__tag" alt="right-arrow" />
                    </div>
                    <div className="col">
                        <p className="sel__tag__title">#sports</p>
                        <p className="sel__tag__count">6.4m posts</p>
                    </div>
                </div>
            </div>



            <style jsx>
                {`
                    .lbl__brod{
                        color: #666666;
                        font-size: 12px;
                        font-family: 'Roboto', sans-serif !important;
                    }

                    .ipt__brod{
                        background-color: #F1F2F6;
                        border-radius: 20px;
                        border-color: #F1F2F6;
                    }
                    .ipt__brod::placeholder {
                        color: #A5A5A5 !important;
                        font-size: 15px !important;
                        opacity: 0.7 !important;

                    }
                    
                    .ipt__brod:-ms-input-placeholder {
                        color: #A5A5A5 !important;
                        font-size: 15px !important;
                        opacity: 0.7 !important;
                    }
                    
                    .ipt__brod::-ms-input-placeholder {
                        color: #A5A5A5 !important;
                        font-size: 15px !important;
                        font-family: 'Roboto', sans-serif !important;
                        opacity: 0.7 !important;
                    }

                    .backArr__img{
                        position: absolute;
                        width: 26px;
                        z-index: 1;
                        cursor: pointer;
                    }

                    .pg__title{
                        color: #000000;
                        font-size: 18px;
                        font-family: 'Roboto', sans-serif !important;
                    }

                    

                    .setPosRht{
                        position: absolute;
                        cursor: pointer;
                        right: 15px;
                        top: 50%;
                        width: 12px;
                        transform: translateY(-50%);
                        z-index: 1;
                    }

                    .rot__cus{
                        transform: translateY(-50%) rotate(
                        90deg
                        );
                    }

                    .pg__scrl{
                        overflow-y: scroll;
                        height: 100vh;
                    }

                    .pg__scrl::-webkit-scrollbar {
                        display: none !important;
                    }
                    
                    .pg__scrl {
                        -ms-overflow-style: none; 
                        scrollbar-width: none; 
                    }

                    .ipt__selTag{
                        border-radius: .25rem !important;
                    }

                    .prof__img__tag{
                        width: 37px;
                        height: 37px;
                        border-radius: 50%;
                        object-fit: cover;
                    }

                    .sel__tag__title{
                        color: #000000;
                        font-size: 16px;
                        font-family: 'Roboto', sans-serif !important;
                        margin: 0;
                    }

                    .sel__tag__count{
                        color: #B1B6D1;
                        font-size: 12px;
                        font-family: 'Roboto', sans-serif !important;
                        margin: 0;
                    }
                `}
            </style>
        </div>
    );
};
export default SelectTag;
