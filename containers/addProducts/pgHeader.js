import React from "react";
import * as config from "../../lib/config";
const PgHeader = () => {
    return (
        <div className="col-12 py-3">
            <img src={config.backArrow} width="26" className="backArr__img" alt="back-arrow" />
            <h5 className="text-center pg__title mb-0">Products</h5>
            <img src={config.PLUS__IMG__BLACK} width="22" className="setRtMid" alt="back-arrow" />
            
            <style jsx>
                {`
                    .backArr__img{
                        position: absolute;
                        width: 26px;
                        z-index: 1;
                        cursor: pointer;
                    }

                    .setRtMid{
                        position: absolute;
                        z-index: 1;
                        cursor: pointer;
                        right: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                    }

                    .pg__title{
                        color: #000000;
                        font-size: 18px;
                        font-family: 'Roboto', sans-serif !important;
                    }
                    
                `}
            </style>
        </div>
    );
};
export default PgHeader;
